# Mini Project: Discord Bot

## Date: 25 - Aug - 2020

### Tech-Stack

- NodeJS
- Discord.js
- dotenv

### Deploy

https://discord-bot-dfkgjhjdkfg.herokuapp.com/

### Screenshot

<img src="https://i.imgur.com/snzfdBE.png" />

### Functions

- Kick
- Ban
- Reaction to set Role
- Announcements

### Plan Of Action

- Project Setup
- Creating Discord Application
- Adding the Bot to our Discord Server
- Logging the bot In
- Basic Events
- Ready Event
- Message Events
- Bot Responses
- Basic Chat Commands
- Kick Command
- Ban Command
- Message Reactions & Reaction Roles
- Webhooks

### After this project

I have understand about

- Basic knowledge in setup a discord bot
- Create function Kick, Ban, Reaction to set Role

Next Steps:

- Add Mute function

### Directory Structure

```
.
├── package.json
├── package-lock.json
├── README.md
├── .env
└── src
    └── bot.js
```

### Set up

- `git clone`
- `npm install`

- Adding the Bot to discord server
  - discord.com/developers/applications > General Information > CLIENT_ID
  - https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&scope=bot
- Update token in `.env`

  - DISCORDJS_BOT_TOKEN: discord.com/developers/applications ~> BOT > TOKEN
  - Setting Webhooks
    - Setting text channel > Integrations > New Webhook > Copy Webhook URL
    - Get WEBHOOK_ID & WEBHOOK_TOKEN in URL
    - https://discordapp.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN

- `npm run start`
