const config = require('../config');
const axios = require('axios');
const { delay } = require('@whiskeysockets/baileys')

module.exports = {
    name: ["ask", "ai"],
    description: "Ask the AI assistant a question",
    limit: 1,
    async execute(m, client) {
        // Mengambil teks dari pesan
        const args = m.text.split(" ");
        const query = args.slice(1).join(" "); // Mengambil semua argumen setelah perintah

        if (!query) {
            return m.reply("Please provide a question or text to ask.");
        }

        try {
            // Mengambil respons dari API
            const response = await axios.get(`${config.apiurl.widipie}/prompt/gpt`, {
                params: {
                    prompt: config.promptAi,
                    text: query
                }
            });

            // Memeriksa apakah respons berhasil
            if (response.data.result) {
                await client.sendPresenceUpdate('composing', m.chat)
                delay(1500)
                m.reply(response.data.result);
            } else {
                m.reply(`${config.pesan.error}`);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            m.reply(`${config.pesan.error}`);
        }
    },
};
