const { runtime } = require('../lib/extra'); // Impor fungsi runtime
const os = require('os'); // Untuk mendapatkan informasi uptime dari sistem

module.exports = {
    name: ["runtime", "uptime"],
    description: "Displays the bot's uptime",
    category: ["Info"],
    async execute(m, client) {
        try {
            const uptimeSeconds = os.uptime();
            const formattedUptime = runtime(uptimeSeconds);

            await client.sendMessage(m.chat, {
                text: `Bot has been running for: ${formattedUptime}`
            }, {
                quoted: m
            });
        } catch (error) {
            console.error("Error getting runtime:", error);
            m.reply("An error occurred while fetching the bot's runtime.");
        }
    },
};
