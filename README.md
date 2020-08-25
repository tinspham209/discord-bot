# Mini Project: Discord Bot

## Date: 25 - Aug - 2020

### Tech-Stack

- NodeJS
- Discord.js v12
- dotenv
- ytdl-core : Convert youtube link to audio
- opusscript
- ffmpeg-static : Need FFMPEG For Any Music Bot To Work
- moment : time format

### Screenshot

<img src="https://i.imgur.com/snzfdBE.png" />

### Functions

- Kick : `$kick @[user_name] [reason]`
- Ban : `$ban [user_id]`
- Reaction to set Role : reaction :watermelon: icon to add `Verified` role
- Announcements: `$announce [text]`
- Music BOT:
  - Play: `$play [url]`
  - Add to queue: `$play [url]`
  - Stop: `$stop`
  - Skip: `$skip`
  - Pause: `$pause`
  - Resume: `$resume`
  - change Volume : `$volume [1-5]` - default: 5
  - Now Playing: `$nowplaying`
  - check song queue: `$queue`

### Plan Of Action

- Project Setup
- Creating Discord Application
- Adding the Bot to our Discord Server
- Logging the bot In Discord Server
- Basic Events
- Ready Event
- Message Events
- Bot Responses
- Basic Chat Commands
- Kick Command
- Ban Command
- Message Reactions & Reaction Roles
- Announce command - Webhooks
- Play command
- Stop command
- Create Queue system
- Add song to queue
- Skip command
- Pause command
- Resume command
- change Volume command
- NowPlaying command
- check song queue command
- Refactor
  - kick command

### After this project

Next Steps:

- Music is playing but response too longgggg 😂
- Add youtube search function

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
  - https://discord.com/developers/applications > General Information > `CLIENT_ID`
  - And type URL in your browser:
    - https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&scope=bot
- Update token in `.env`

  - `DISCORDJS_BOT_TOKEN`:
    - https://discord.com/developers/applications ~> BOT > TOKEN
  - Setting Webhooks
    - Setting text channel > Integrations > New Webhook > Copy Webhook URL
    - Get `WEBHOOK_ID` & `WEBHOOK_TOKEN` in URL
    - https://discordapp.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
  - `REACTION_MESSAGE_ID` : ID of comment that you want to set function reaction to set role
  - `ROLE_NAME` = icon that you want - example: `:watermelon:`
  - `ROLE_ID` = ID of roles that you want to set in server setting > roles

- If you want to add more reaction roles. You need to update code at `src/bot.js` in function `messageReactionAdd` &`messageReactionRemove`

  - Add new name in `.env`. example: `ROLE_NAME_2` & `ROLE_ID_2`
  - Add more case at `switch case` in 2 functions

- `npm run start`
- Or `npm run dev` in development: nodemon
