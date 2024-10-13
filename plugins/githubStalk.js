const axios = require('axios');

module.exports = {
    name: ["githubstalk", "github"],
    description: "Get public events of a GitHub user.",
    category: ["Utility"],
    forOwner: false,
    limit: 5,
    execute: async (m, client) => {
        const args = m.text.trim().split(" ");
        const username = args[1]; // Username GitHub yang akan dicari

        if (!username) {
            return m.reply("Please provide a GitHub username.");
        }

        try {
            const events = await getGithubEvents(username);
            if (events.length === 0) {
                return m.reply("No public events found for this user.");
            }

            // Mengirim hasil sebagai JSON
            const jsonresponse = JSON.stringify(events, null, 2);
            m.reply(`Here are the public events for ${username}:\n\n${jsonresponse}`);
        } catch (error) {
            console.error(error);
            m.reply("An error occurred while fetching the data. Please try again.");
        }
    },
};

// Fungsi untuk mendapatkan acara publik pengguna dari GitHub
async function getGithubEvents(username) {
    const url = `https://api.github.com/users/${username}/events/public`;
    const response = await axios.get(url);
    return response.data;
}
