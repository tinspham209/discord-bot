require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();

client.on("ready", () => {
	console.log(`${client.user.tag} has logged in.`);
});

client.on("message", (message) => {
	if (message.author.bot) {
		return;
	}
	console.log(`[${message.author.tag}]: ${message.content}`);
	if (message.content === "hello") {
		message.reply("hello there !");
	}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
