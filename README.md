# Mini Project: Discord Moderation & Music BOT

## Date: 25 - Aug - 2020

### Tech-Stack

- NodeJS v14.7
- Discord.js v12
- dotenv : store variable `process.env.variable_name`
- ytdl-core : Convert youtube link to audio
- opusscript
- ffmpeg-static : Need FFMPEG For Any Music Bot To Work
- moment : time format
- ms : convert string seconds to number: Input: 100s > `numbers`

### Screenshot

<img src="https://i.imgur.com/vSPWEkd.png" />

### Functions

- MODERATION BOT:

  - Kick : `$kick @[user_name] [reason-reason]`
    - \$kick @Rafen spamming
  - Ban : `$ban @[user_name] [reason-reason]`
    - \$ban @Rafen spamming
  - Soft ban : `$softban @[user_name] [reason-reason]` - default: 1 day
    - \$softban @Rafen spamming
  - Temp ban: `tempban @[user_name] [reason-reason] [seconds]s`
    - \$tempban @Rafen Breaking-rule 200s
  - Mute : `$mute @[user_name] [reason-reason] [seconds]s`
    - \$mute @Rafen spamming 100s
  - UnMute: `$unmute @[user_name] [reason-reason]`
    - \$unmute @Rafen ccc
  - Reaction to set Role:
    - Reaction :watermelon: icon to add `Verified` role
  - Send text in bot-command channel, BOT send announcements to specify channel: `$announce [text]`
    - \$announce Hello everybody

- MUSIC BOT:
  - Play: `$play [youtube_url]`
    - \$play https://www.youtube.com/watch?v=gwpud7f_nDk
  - Add music to queue: `$play [youtube_url]`
    - \$play https://www.youtube.com/watch?v=gwpud7f_nDk
  - Stop: `$stop`
  - Skip: `$skip`
  - Pause: `$pause`
  - Resume: `$resume`
  - change Volume : `$volume [1-5]` - default: 5
    - \$volume 3
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
  - Kick with new logic
  - Ban with new logic
- Soft Ban command
- Mute command
- UnMute command
- Temp Ban command

### After this project

Next Steps:

- Music is playing but response too longgggg 😂
- Add youtube search function
- Add/Remove Role
- Create/Delete Role
- Create/Delete Channel
- Refactor code by split specify function in specify folder

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
  - Setting Webhooks in specify channel that you want BOT send announcements
    - Setting text channel > Integrations > New Webhook > Copy Webhook URL
    - Get `WEBHOOK_ID` & `WEBHOOK_TOKEN` in URL
    - https://discordapp.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
  - `REACTION_MESSAGE_ID` : ID of comment that you want to set function reaction to set role
  - `ROLE_NAME` = icon that you want - example: `:watermelon:`
  - `ROLE_ID` = ID of roles that you want to set in server setting > roles

- If you want to add more reaction roles. You need to update code at `src/bot.js` in function `messageReactionAdd` &`messageReactionRemove`

  - Add new name in `.env`. example: `ROLE_NAME_2` & `ROLE_ID_2`
  - Add more case at `switch case` in 2 functions
  - `ROLE_MUTE_ID` : Role ID that is already mute in server setting > roles

- `npm run start`
- Or `npm run dev` in development: nodemon
