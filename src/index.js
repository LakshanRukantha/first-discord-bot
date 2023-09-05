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

client.on("messageCreate", async (msg) => {
  // Ignore messages from bots
  if (msg.author.bot) {
    return;
  } else {
    try {
      // Reply to messages
      if (msg.content === "ping") {
        const startTime = Date.now();
        const sentMessage = await msg.reply("Pinging...");
        const endTime = Date.now();
        const pingTime = endTime - startTime;

        sentMessage.edit(
          `Pong! Bot latency is ${pingTime}ms, Message latency is ${
            sentMessage.createdTimestamp - msg.createdTimestamp
          }ms.`
        );
      }

      //   Log all messages
      logger.info(`${msg.author.tag} said: ${msg.content}`);

      if (msg.content === "hello") {
        await msg.reply(`Hello ${msg.author.username}!`);
      }

      // Reply with the author's avatar
      if (msg.content === "avatar") {
        const avatarURL = msg.author.displayAvatarURL({
          format: "png",
          dynamic: true,
        });
        await msg.reply({ files: [avatarURL] });
      }

      // Display author info
      if (msg.content === "info") {
        const user = msg.author;
        const userTag = user.tag;
        const userID = user.id;
        const userAvatar = user.displayAvatarURL({
          format: "png",
          dynamic: true,
        });
        const userCreatedAt = user.createdAt;
        const userCreatedAtFormatted = userCreatedAt.toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        const member = msg.member;
        const userJoinedAt = member.joinedAt;
        const userJoinedAtFormatted = userJoinedAt.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const userRoles = member.roles.cache
          .map((role) => role.name)
          .join(", ");

        const userInfoEmbed = {
          color: 0x0099ff,
          title: `${userTag}`,
          thumbnail: {
            url: `${userAvatar}`,
          },
          fields: [
            {
              name: "User ID",
              value: `${userID}`,
              inline: true,
            },
            {
              name: "Account Created",
              value: `${userCreatedAtFormatted}`,
              inline: true,
            },
            {
              name: "Joined Server",
              value: `${userJoinedAtFormatted}`,
              inline: true,
            },
            {
              name: "Roles",
              value: `${userRoles}`,
              inline: true,
            },
          ],
        };

        await msg.reply({ embeds: [userInfoEmbed] });
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  }
});
