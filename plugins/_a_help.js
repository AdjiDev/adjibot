// plugins/help.js
const config = require("../config");
const chalk = require("chalk");

module.exports = {
  name: ["help", "commands", "cmd", "menu"],
  description: "List available commands or commands by category",
  category: ["Main"],
  execute(m, client, prefix) {
    try {
      const sender = [m.sender];
      const args = m.text.trim().split(/ +/).slice(1);
      const requestedCategory = args[0] ? args[0].toLowerCase() : null; 
      const totalPlugins = Object.keys(global.plugins).length;
      const categorizedCommands = {};

      config.category.forEach((cat) => {
        categorizedCommands[cat.toLowerCase()] = []; 
      });

      Object.values(global.plugins).forEach((plugin) => {
        const category = plugin.category ? plugin.category[0].toLowerCase() : "other";

        if (categorizedCommands[category]) {
          const names = Array.isArray(plugin.name) ? plugin.name.join(", ") : plugin.name || "Unknown Command";
          categorizedCommands[category].push({
            name: names,
            description: plugin.description || "No description available",
          });
        } else {
          categorizedCommands["other"].push({
            name: plugin.name || "Unknown Command",
            description: plugin.description || "No description available",
          });
        }
      });

      let helpText = `
Library: Automaton Baileys
UsedPrefix: *${config.botName}*
Commands: ${prefix}
Total Plugins: *${totalPlugins}*\n`;

      // Jika pengguna meminta kategori tertentu
      if (requestedCategory) {
        if (categorizedCommands[requestedCategory]) {
          const commandsInCategory = categorizedCommands[requestedCategory];
          if (commandsInCategory.length > 0) {
            helpText += `\n📂 *${requestedCategory.charAt(0).toUpperCase() + requestedCategory.slice(1)}*\n`;
            commandsInCategory.forEach((cmd) => {
              helpText += `┌[ *${cmd.name}* ]\n└> _${cmd.description}_\n`;
            });
          } else {
            helpText += `\nNo commands available in *${requestedCategory}* category.\n`;
          }
        } else {
          helpText += `\nCategory *${requestedCategory}* not found. Please check the available categories.\n`;
        }
      } 
      // Jika pengguna tidak memberikan argumen (menampilkan semua kategori)
      else {
        for (const category in categorizedCommands) {
          if (categorizedCommands[category].length > 0) {
            helpText += `\n📂 *${category.charAt(0).toUpperCase() + category.slice(1)}*\n`;
            categorizedCommands[category].forEach((cmd) => {
              helpText += `┌[ *${cmd.name}* ]\n└> _${cmd.description}_\n`;
            });
          }
        }
      }

      client.sendMessage(
        m.chat,
        {
          text: helpText,
          mentions: sender,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: `${config.botName}`,
              body: `Hai ${m.pushName}`,
              thumbnailUrl: config.thumbnail,
              sourceUrl: config.website,
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    } catch (err) {
      console.error(chalk.red(`[ ERROR ] Failed to execute help command: ${err.message}`));
      client.sendMessage(m.chat, { text: "An error occurred while processing your request." }, { quoted: m });
    }
  },
};
