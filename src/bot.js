require("dotenv").config();

const { Client, WebhookClient, Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const moment = require("moment");

const client = new Client({
	partials: ["MESSAGE", "REACTION"],
});

const webhookClient = new WebhookClient(
	process.env.WEBHOOK_ID,
	process.env.WEBHOOK_TOKEN
);
const PREFIX = "$";
const queue = new Map();

client.on("ready", () => {
	console.log(`${client.user.tag} has logged in.`);
});

client.on("message", async (message) => {
	if (message.author.bot) {
		return;
	}
	const serverQueue = queue.get(message.guild.id);
	const mentionedMember = message.mentions.members.first();
	if (message.content.startsWith(PREFIX)) {
		const [CMD_NAME, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/);
		if (CMD_NAME === "kick") {
			const reason = args[1];
			const user = args[0];

			if (!message.member.hasPermission("KICK_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
				return message.reply("I don't have permissions to kick members");
			}
			if (!user) {
				return message.channel.send("You need to specify someone to kick");
			}
			if (!mentionedMember) {
				return message.channel.send("I can't find that member");
			}
			if (
				mentionedMember.roles.highest.position >=
					message.member.roles.highest.position ||
				message.author.id !== message.guild.owner.id
			) {
				return message.channel.send(
					"You can't kick this member due to your role being lower than theirs or there the guild owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Why would you want to kick yourself?");
			}
			if (mentionedMember.kickable) {
				const embed = new MessageEmbed()
					.setAuthor(
						`${message.author.tag} - (${message.author.id})`,
						message.author.displayAvatarURL()
					)
					.setThumbnail(mentionedMember.user.displayAvatarURL())
					.setColor("#ebb734")
					.setDescription(
						`
**Member:** ${mentionedMember.user.tag}
**Action:** Kick
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
					);
				message.channel.send(embed);
				mentionedMember.kick();
			} else {
				return message.channel.send(
					"I can't kick this user make sure I have permissions"
				);
			}
			return undefined;
		} else if (CMD_NAME === "ban") {
			if (!message.member.hasPermission("BAN_MEMBERS")) {
				return message.reply("You do not have permissions to use that command");
			}
			if (args.length === 0) {
				return message.reply("Please prove an ID");
			}
			try {
				const user = await message.guild.members.ban(args[0]);
				message.channel.send(`User was banned successfully.`);
			} catch (error) {
				message.channel.send(
					`An error occurred. Either I do not have permissions or the user was not found.`
				);
			}
		} else if (CMD_NAME === "announce") {
			const msg = args.join(" ");
			webhookClient.send(msg);
		} else if (CMD_NAME === "play") {
			if (args.length === 0) {
				return message.reply("Please prove an ID");
			}
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to play the bot!"
				);
			}
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has("CONNECT")) {
				return message.channel.send(
					"I don't have permissions to connect to the voice channel"
				);
			}
			if (!permissions.has("SPEAK")) {
				return message.channel.send(
					"I don't have permissions to speak in the voice channel"
				);
			}

			const songInfo = await ytdl.getInfo(args[0]);
			const song = {
				title: Util.escapeMarkdown(songInfo.videoDetails.title),
				url: songInfo.videoDetails.video_url,
			};
			if (!serverQueue) {
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true,
				};
				queue.set(message.guild.id, queueConstruct);
				queueConstruct.songs.push(song);
				try {
					const connection = await voiceChannel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.log(
						`There was an error connecting to the voice channel: ${error}`
					);
					queue.delete(message.guild.id);
					return message.channel.send(
						`There was an error connecting to the voice channel: ${error}`
					);
				}
			} else {
				serverQueue.songs.push(song);
				return message.channel.send(
					`**${song.title}** has been added to the queue.`
				);
			}
			return undefined;
		} else if (CMD_NAME === "stop") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to stop the bot!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
			message.channel.send("I have stopped the music for you");
			return undefined;
		} else if (CMD_NAME === "skip") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to skip the music!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			serverQueue.connection.dispatcher.end();
			message.channel.send("I have skipped the music for you");
			return undefined;
		} else if (CMD_NAME === "volume") {
			const voiceChannel = message.member.voice.channel;
			const volume = args[0];
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to use music commands!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			if (!volume) {
				return message.channel.send(
					`That volume is: **${serverQueue.volume}**`
				);
			}
			if (isNaN(volume)) {
				return message.channel.send(
					`That is not a valid amount to change the volume to`
				);
			}

			serverQueue.volume = volume;
			serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
			message.channel.send(`I have changed the volume to **${volume}**`);
			return undefined;
		} else if (CMD_NAME === "nowplaying") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to use music commands!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			message.channel.send(`Now Playing: **${serverQueue.songs[0].title}**`);
			return undefined;
		} else if (CMD_NAME === "queue") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to use music commands!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			message.channel.send(
				`
__**Song Queue:**__
${serverQueue.songs.map((song) => `**-** ${song.title}`).join("\n")}
__**Now Playing:**__  ${serverQueue.songs[0].title}
			`,
				{ split: true }
			);
			return undefined;
		} else if (CMD_NAME === "pause") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to use the pause commands!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			if (!serverQueue.playing) {
				return message.channel.send("The music is already paused.");
			}
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			message.channel.send("I have now paused the music for you.");
			return undefined;
		} else if (CMD_NAME === "resume") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to use the pause commands!"
				);
			}
			if (!serverQueue) {
				return message.channel.send("There is nothing playing");
			}
			if (serverQueue.playing) {
				return message.channel.send("The music is already playing.");
			}
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			message.channel.send("I have now resumed the music for you.");
		}
	}
});

const play = (guild, song) => {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection
		.play(ytdl(song.url, { filter: "audio" }))
		.on("finish", () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on("error", (error) => {
			console.log("Error" + error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`Start Playing: **${song.title}**`);
};

client.on("messageReactionAdd", (reaction, user) => {
	console.log("reaction add");
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === "747705383048708259") {
		switch (name) {
			case "🍉":
				member.roles.add("747691484538732595");
				break;
		}
	}
});

client.on("messageReactionRemove", (reaction, user) => {
	console.log("reaction remove");
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === "747705383048708259") {
		switch (name) {
			case "🍉":
				member.roles.remove("747691484538732595");
				break;
		}
	}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
