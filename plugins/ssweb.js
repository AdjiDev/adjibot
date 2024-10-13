// plugins/ssweb.js
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: ["ssweb", "screenshot", "ss"],
    description: "Take a screenshot of a website",
    category: ["Automaton"],
    limit: 1,
    async execute(m, client) {
        const args = m.text.split(" ");
        const url = args[1];
        if (!url) {
            return m.reply("Please provide a URL.");
        }
        try {
            const response = await axios.get(`${config.apiurl.widipie}/ssfull?url=${encodeURIComponent(url)}`, { responseType: 'arraybuffer' });
            
            if (response.data) {
                const tempFilePath = path.join(__dirname, 'screenshot.jpg');
                fs.writeFileSync(tempFilePath, Buffer.from(response.data, 'binary'));
                await m.reply(`${config.pesan.loading}`)
                await client.sendMessage(m.chat, {
                    image: { url: tempFilePath }, 
                    caption: `Screenshot of ${url}`
                });

                fs.unlinkSync(tempFilePath);
            } else {
                m.reply(`${config.pesan.error}`);
            }
        } catch (error) {
            console.error("Error fetching screenshot:", error);
            m.reply(`${config.pesan.error}`);
        }
    },
};
