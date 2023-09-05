require("dotenv").config();
const logger = require("./utils/logger.js");
const { Client, IntentsBitField } = require("discord.js");

const bot_token = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  logger.info(`${c.user.tag} is live!`);
});

client.login(bot_token);