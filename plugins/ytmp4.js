const fetch = require("node-fetch");

module.exports = {
  name: ["ytmp4", "ytvideo"],
  description: "Download YouTube video as MP4",
  category: ["Downloader"],
  limit: 1,
  async execute(m, client) {
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) {
      return m.reply("Please provide a YouTube link.");
    }

    const videoUrl = args[0];
    const apiUrl = `https://widipe.com/download/ytdl?url=${encodeURIComponent(videoUrl)}`;

    try {
      // Fetching data from Widipe API
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Check if the API response is valid
      if (!data.status || !data.result.mp4) {
        return m.reply("Failed to retrieve MP4 download link.");
      }

      // Format response text
      const resultText = `📹 *YouTube MP4 Download*\n\n`
        + `*Title:* ${data.result.title}\n`
        + `*Duration:* ${data.result.duration}\n`
        + `*Views:* ${data.result.views}\n`
        + `*Channel:* ${data.result.name}\n`
        + `*Download Link:* ${data.result.mp4}`;

      await client.sendMessage(m.chat, {
        react: {
            text: "🕛",
            key: m.key
        }
      }, {
        quoted: m
      })
      await client.sendMessage(m.chat, {
        video: {
            url: data.result.mp4
        },
        caption: "Results"
      });

    } catch (error) {
      console.error("YTMP4 Error:", error);
      m.reply("An error occurred while trying to download the MP4.");
    }
  },
};
