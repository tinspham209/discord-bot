require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client({
	partials: ["MESSAGE", "REACTION"],
});
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
