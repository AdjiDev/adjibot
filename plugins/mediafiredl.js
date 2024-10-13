const config = require('../config');
const axios = require('axios');
const { category } = require('./hello');

module.exports = {
    name: ["mfdl", "mediafire"],
    description: "Download files from MediaFire",
    category: ["Downloader"],
    limit: 1,
    async execute(m, client) {
        const args = m.text.split(" ");
        const url = args[1];

        if (!url) {
            return m.reply("Please provide a MediaFire file URL.");
        }

        try {
            const response = await axios.get(`${config.apiurl.widipie}/mediafire?link=${encodeURIComponent(url)}`);
            if (response.data.result && response.data.result.url) {
                const docUrl = response.data.result.url; // URL dokumen
                await client.sendMessage(
                    m.chat,
                    {
                        document: { url: docUrl },
                        mimetype: 'application/octet-stream', // MIME type untuk file yang diunduh
                        fileName: `${response.data.result.filename}` || "Downloaded_File" // Menggunakan nama file dari respons
                    },
                    { quoted: m }
                );
            } else {
                m.reply("Failed to retrieve the file from MediaFire. Please check the URL and try again.");
            }
        } catch (error) {
            console.error("Error fetching MediaFire file:", error);
            m.reply(`${config.pesan.error}`);
        }
    },
};
