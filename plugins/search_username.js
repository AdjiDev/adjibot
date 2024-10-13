const axios = require('axios');
const cheerio = require('cheerio');
const ora = require('ora');

const socialMedia = [
    // ... (daftar sosial media tetap sama, kecuali menghapus pengulangan untuk "Behance")
];

module.exports = {
    name: ["findsocial", "social"],
    description: "Find username on various social media platforms.",
    category: ["Utility"],
    limit: 1,
    forOwner: false,
    execute: async (m, client) => {
        if (!m.text || !m.text.trim()) {
            return m.reply("Please provide a username to search.");
        }

        const args = m.text.trim().split(" ");
        const username = args[1]; // Username to find
        
        if (!username) {
            return m.reply("Please provide a username to search.");
        }

        const results = await findUsernameOnSocialMedia(username);
        const response = results
            .map(result => `${result.type}: ${result.link ? result.link : "Not Found"}`)
            .join("\n");

        m.reply(response || "No results found for the username provided.");
    },
};

// Fungsi untuk mencari username di media sosial
async function findUsernameOnSocialMedia(username) {
    const results = [];
    const axiosInstance = axios.create({ timeout: 5000 });
    const spinner = ora('Searching for username on social media...').start();

    const platformPromises = socialMedia.map(async (platform) => {
        const url = platform.url.replace('{}', username);
        try {
            const response = await axiosInstance.get(url);
            const $ = cheerio.load(response.data);

            if ($('title').text().includes('404') || /not found/i.test($('body').text())) {
                return { type: platform.name, username: username, link: null };
            } else {
                return { type: platform.name, username: username, link: url };
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { type: platform.name, username: username, link: null };
            } else {
                return { type: platform.name, username: username, link: `Error: ${error.message}` };
            }
        }
    });

    const finalResults = await Promise.all(platformPromises);
    
    spinner.stop();
    return finalResults;
}
