const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: ["dalle", "text2img"],
    description: "Generate an image from text using DALL-E",
    category: ["Other"],
    limit: 1,
    async execute(m, client) {
        const args = m.text.split(" ");
        const textDescription = args.slice(1).join(" ");

        if (!textDescription) {
            return m.reply("Please provide a description for the image.");
        }

        const apiUrls = [
            `${config.apiurl.widipie}/v1/text2img?text=${encodeURIComponent(textDescription)}`,
            `${config.apiurl.widipie}/v2/text2img?text=${encodeURIComponent(textDescription)}`,
            `${config.apiurl.widipie}/v3/text2img?text=${encodeURIComponent(textDescription)}`
        ];

        async function fetchImageWithFallback(urls, retries = 3, delay = 2000) {
            for (let url of urls) {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await axios.get(url, { responseType: 'arraybuffer' }); 
                        if (response.data) {
                            return Buffer.from(response.data, 'binary'); 
                        }
                    } catch (error) {
                        console.error(`Attempt ${i + 1} failed for URL ${url}:`, error.message);
                        if (i < retries - 1) {
                            await new Promise(res => setTimeout(res, delay)); 
                        }
                    }
                }
            }
            throw new Error("Failed to fetch image after multiple attempts with all URLs.");
        }

        try {
            const imageBuffer = await fetchImageWithFallback(apiUrls);

            const tempFilePath = path.join(__dirname, 'temp_image.jpg');
            fs.writeFileSync(tempFilePath, imageBuffer);

            await client.sendMessage(m.chat, {
                image: { url: tempFilePath },
                caption: `Here is your image based on the description: "${textDescription}"`
            });

            fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error("Error generating image:", error);
            m.reply(`${config.pesan.error}`);
        }
    },
};
