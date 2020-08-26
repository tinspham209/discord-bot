require("dotenv").config();

const { Client, WebhookClient, Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const moment = require("moment");
const ms = require("ms");

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
	client.user.setActivity("⚠️ $help ⚠️ ");
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
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
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
		} else if (CMD_NAME === "help") {
			const embed = new MessageEmbed().setColor("#ebb734").setDescription(`
__**MODERATION BOT:**__
	- **Kick:**"$kick @[user_name] [reason]"
	- **Ban: **"$ban @[user_name] [reason]"
	- **Soft ban: **"$softban @[user_name] [reason]"
	- **Temp ban: **"temp @[user_name] [reason] [seconds]"
	- **Mute: ** "$mute @[user_name] [reason] [seconds]"
	- **UnMute: **"$unmute @[user_name] [reason]"
	- **Announcements: **"$announce [text]"

__**MUSIC BOT:**__
	- **Play: **"$play [youtube_url]"
	- **Add music to queue: **"$play [youtube_url]"
	- **Stop: **"$stop"
	- **Skip: **"$skip"
	- **Pause: **"$pause"
	- **Resume: **"$resume"
	- **change Volume: **"$volume [1-5]" - default: 5
	- **Now Playing: **"$nowplaying"
	- **check song queue: **"$queue"
			`);
			return message.channel.send(embed);
		} else if (CMD_NAME === "ban") {
			const reason = args[1];
			const user = args[0];
			if (!message.member.hasPermission("BAN_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
				return message.reply("I don't have permissions to ban members");
			}
			if (!user) {
				return message.channel.send("You need to specify someone to ban");
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
					"You can't ban that member due to your role being lower than theirs or there the guild owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Why would you want to ban yourself?");
			}
			if (mentionedMember.bannable) {
				const embed = new MessageEmbed()
					.setAuthor(
						`${message.author.tag} - (${message.author.id})`,
						message.author.displayAvatarURL()
					)
					.setThumbnail(mentionedMember.user.displayAvatarURL())
					.setColor("#ebb734")
					.setDescription(
						`
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
**Action:** Ban
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
					);
				message.channel.send(embed);
				mentionedMember.ban();
			} else {
				return message.channel.send(
					"I can't ban this user make sure my role is above theirs"
				);
			}
			return undefined;
		} else if (CMD_NAME === "softban") {
			const reason = args[1];
			const user = args[0];
			if (!message.member.hasPermission("BAN_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
				return message.reply("I don't have permissions to ban members");
			}
			if (!user) {
				return message.channel.send("You need to specify someone to ban");
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
					"You can't softBan some one who is equal or has a higher role to you or they are the owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Why would you want to softBan yourself?");
			}
			if (mentionedMember.bannable) {
				const embed = new MessageEmbed()
					.setAuthor(
						`${message.author.tag} - (${message.author.id})`,
						message.author.displayAvatarURL()
					)
					.setThumbnail(mentionedMember.user.displayAvatarURL())
					.setColor("#ebb734")
					.setDescription(
						`
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
**Action:** Soft Ban
**Length:** 1day
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
					);
				message.channel.send(embed);
				mentionedMember
					.ban({ days: 1 })
					.then(() => message.guild.members.unban(mentionedMember.id));
			} else {
				return message.channel.send(
					"I don't have permissions to softBan this member make sure my role is higher than theirs"
				);
			}
			return undefined;
		} else if (CMD_NAME === "tempban") {
			const user = args[0];
			const reason = args[1];
			const times = args[2];
			const regex = /\d+[smhdw]/.exec(times);
			if (!message.member.hasPermission("BAN_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
				return message.reply("I don't have permissions to ban members");
			}
			if (!user) {
				return message.channel.send("You need to specify someone to tempBan");
			}
			if (!mentionedMember) {
				return message.channel.send("I can't find that member");
			}
			if (!times) {
				return message.channel.send(
					"You need to specify how long you want to ban this user for"
				);
			}
			if (!regex) {
				return message.channel.send(
					"That is not a valid amount of time to ban"
				);
			}
			if (ms(regex[0]) > 214748367) {
				return message.channel.send(
					"Make sure you don't tempBan a member for more than 25days"
				);
			}
			if (
				mentionedMember.roles.highest.position >=
					message.member.roles.highest.position ||
				message.author.id !== message.guild.owner.id
			) {
				return message.channel.send(
					"You can't tempBan that member who is equal or has a higher role to you or they are the owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Why would you want to tempBan yourself?");
			}
			const embed = new MessageEmbed()
				.setAuthor(
					`${message.author.tag} - (${message.author.id})`,
					message.author.displayAvatarURL()
				)
				.setThumbnail(mentionedMember.user.displayAvatarURL())
				.setColor("#ebb734")
				.setDescription(
					`
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
**Action:** TempBan
**Length:** ${regex}
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
				);
			message.channel.send(embed);
			mentionedMember.ban();
			setTimeout(() => {
				if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
					return message.reply("I don't have permissions to unban members");
				}
				message.guild.members.unban(mentionedMember.id);
				message.channel.send(
					`${mentionedMember} has been unbanned after ${times}`
				);
			}, ms(regex[0]));
			return undefined;
		} else if (CMD_NAME === "mute") {
			const user = args[0];
			const reason = args[1];
			const times = args[2];
			const regex = /\d+[smhdw]/.exec(times);
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
				return message.reply("I don't have permissions to mute members");
			}
			if (!user) {
				return message.channel.send("You need to specify someone to mute");
			}
			if (!mentionedMember) {
				return message.channel.send("I can't find that member");
			}
			if (!times) {
				return message.channel.send(
					"You need to specify how long you want to mute this user"
				);
			}
			if (!regex) {
				return message.channel.send(
					"That is not a valid amount of time to mute"
				);
			}
			if (ms(regex[0]) > 214748367) {
				return message.channel.send(
					"Make sure you don't mute a member for more than 25days"
				);
			}
			if (
				mentionedMember.roles.highest.position >=
					message.member.roles.highest.position ||
				message.author.id !== message.guild.owner.id
			) {
				return message.channel.send(
					"You can't mute that member who is equal or has a higher role to you or they are the owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Why would you want to mute yourself?");
			}
			const embed = new MessageEmbed()
				.setAuthor(
					`${message.author.tag} - (${message.author.id})`,
					message.author.displayAvatarURL()
				)
				.setThumbnail(mentionedMember.user.displayAvatarURL())
				.setColor("#ebb734")
				.setDescription(
					`
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
**Action:** Mute
**Length:** ${regex}
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
				);
			message.channel.send(embed);
			if (mentionedMember.roles.cache.has(process.env.ROLE_MUTE_ID)) {
				return message.reply("This member is already muted");
			}
			mentionedMember.roles.add(process.env.ROLE_MUTE_ID);
			setTimeout(() => {
				if (!mentionedMember.roles.cache.has(process.env.ROLE_MUTE_ID)) {
					return undefined;
				}
				mentionedMember.roles.remove(process.env.ROLE_MUTE_ID);
				message.channel.send(
					`${mentionedMember} has now been unmuted after ${regex[0]}`
				);
			}, ms(regex[0]));
			return undefined;
		} else if (CMD_NAME === "unmute") {
			const user = args[0];
			const reason = args[1];
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				return message.reply("You don't have permissions to use that command");
			}
			if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
				return message.reply("I don't have permissions to mute members");
			}
			if (!user) {
				return message.channel.send("You need to specify member to unmute");
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
					"You can't mute that member who is equal or has a higher role to you or they are the owner"
				);
			}
			if (mentionedMember.id === message.author.id) {
				return message.channel.send("Nice try... you can't unmute yourself");
			}
			if (!mentionedMember.roles.cache.has(process.env.ROLE_MUTE_ID)) {
				return message.channel.send("This member is not muted");
			}
			const embed = new MessageEmbed()
				.setAuthor(
					`${message.author.tag} - (${message.author.id})`,
					message.author.displayAvatarURL()
				)
				.setThumbnail(mentionedMember.user.displayAvatarURL())
				.setColor("#ebb734")
				.setDescription(
					`
**Member:** ${mentionedMember.user.tag} - (${mentionedMember.user.id})
**Action:** UnMute
**Reason:** ${reason || "Undefined"}
**Channel:** ${message.channel}
**Time:** ${moment().format("llll")}
					`
				);
			message.channel.send(embed);
			mentionedMember.roles.remove(process.env.ROLE_MUTE_ID);
			return undefined;
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
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === process.env.REACTION_MESSAGE_ID) {
		switch (name) {
			case process.env.ROLE_NAME:
				member.roles.add(process.env.ROLE_ID);
				break;
		}
	}
});

client.on("messageReactionRemove", (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === process.env.REACTION_MESSAGE_ID) {
		switch (name) {
			case process.env.ROLE_NAME:
				member.roles.remove(process.env.ROLE_ID);
				break;
		}
	}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
