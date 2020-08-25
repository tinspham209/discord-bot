require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();
const PREFIX = "$";

client.on("ready", () => {
	console.log(`${client.user.tag} has logged in.`);
});

client.on("message", (message) => {
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
		}
	}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
