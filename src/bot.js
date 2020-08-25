require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");
const ytdl = require("ytdl-core");

const client = new Client({
	partials: ["MESSAGE", "REACTION"],
});

const webhookClient = new WebhookClient(
	process.env.WEBHOOK_ID,
	process.env.WEBHOOK_TOKEN
);
const PREFIX = "$";

client.on("ready", () => {
	console.log(`${client.user.tag} has logged in.`);
});

client.on("message", async (message) => {
	if (message.author.bot) {
		return;
	}
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
			try {
				const connection = await voiceChannel.join();
			} catch (error) {
				console.log(
					`There was an error connecting to the voice channel: ${error}`
				);
				return message.channel.send(
					`There was an error connecting to the voice channel: ${error}`
				);
				const dispatcher = connection
					.play(ytdl(args[0], { filter: "audio" }))
					.on("playing")
					.on("finish", () => {
						voiceChannel.leave();
					})
					.on("error", (error) => {
						console.log(error);
					});
			}
		} else if (CMD_NAME === "stop") {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					"You must be in a voice channel to stop the bot!"
				);
			}
			message.channel.send(
				"The player has stopped and the queue has been cleared."
			);
			voiceChannel.leave();
			return undefined;
		}
	}
});

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
