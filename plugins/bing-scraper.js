const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: ["bing"],
    description: "Search Bing for a query.",
    category: ["Utility"],
    async execute(m, client) {
        const args = m.text.split(" ");
        const query = args.slice(1).join(" ");

        if (!query) {
            return m.reply("Please provide a search query.");
        }

        try {
            const response = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
            const html = response.data;
            const $ = cheerio.load(html);

            const results = [];

            $('.b_algo').each((i, element) => {
                const title = $(element).find('h2 a').text();
                const link = $(element).find('h2 a').attr('href');
                const snippet = $(element).find('.b_caption p').text();

                if (title && link) {
                    results.push({
                        title: title,
                        link: link,
                        snippet: snippet
                    });
                }
            });

            if (results.length === 0) {
                return m.reply("No results found.");
            }

            let reply = "Bing Search Results:\n\n";
            results.forEach((result, index) => {
                reply += `${index + 1}. **${result.title}**\n${result.snippet}\n${result.link}\n\n`;
            });

            if (reply.length > 4096) {
                reply = reply.slice(0, 4093) + '...';
            }

            m.reply(reply);
        } catch (error) {
            console.error("Error searching Bing:", error);
            m.reply("An error occurred while searching Bing.");
        }
    },
};
