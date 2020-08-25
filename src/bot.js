require("dotenv").config();

const { Client, WebhookClient, Util } = require("discord.js");
const ytdl = require("ytdl-core");

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
	if (message.content.startsWith(PREFIX)) {
		const [CMD_NAME, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/);
		if (CMD_NAME === "kick") {
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				return message.reply("You do not have permissions to use that command");
			}
			if (args.length === 0) {
				return message.reply("Please prove an ID");
			}
			const member = message.guild.members.cache.get(args[0]);
			if (member) {
				member
					.kick()
					.then((member) => message.channel.send(`${member} was kicked.`))
					.catch((error) =>
						message.channel.send(
							"I do not have permissions to kick that user :("
						)
					);
			} else {
				message.channel.send("That member was not found");
			}
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
