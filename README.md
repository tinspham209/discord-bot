# Mini Project: Discord Bot

## Date: 25 - Aug - 2020

### Tech-Stack

- NodeJS
- Discord.js
- dotenv

### Deploy

### Screenshot

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
- Deploy

### Directory Structure

.
├── package.json
├── package-lock.json
├── README.md
├── .env
└── src
└── bot.js

### Set up

- `git clone`
- `npm install`
- Update token in `.env`

  - Adding the Bot to discord server
    - https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot
  - DISCORDJS_BOT_TOKEN: discord.com/developers/applications ~> BOT > TOKEN
  - Setting Webhooks
    - Setting text channel > Integrations > New Webhook > Copy Webhook URL
    - Get WEBHOOK_ID & WEBHOOK_TOKEN in URL
    - https://discordapp.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN

- `npm run start`
