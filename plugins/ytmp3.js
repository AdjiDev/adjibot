const fetch = require("node-fetch");
const config = require("../config");

module.exports = {
  name: ["ytmp3", "ytaudio"],
  description: "Download YouTube video as MP3",
  category: ["Downloader"],
  limit: 1,
  async execute(m, client) {
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) {
      return m.reply("Please provide a YouTube link.");
    }

    const videoUrl = args[0];
    const Url = `${config.apiurl}/download/ytdl?url=${encodeURIComponent(videoUrl)}`;

    try {
      const response = await fetch(Url);
      const data = await response.json();

      if (!data.status || !data.result.mp3) {
        return m.reply("Failed to retrieve MP3 download link.");
      }

      const resultText = `🎵 *YouTube MP3 Download*\n\n`
        + `*Title:* ${data.result.title}\n`
        + `*Duration:* ${data.result.duration}\n`
        + `*Views:* ${data.result.views}\n`
        + `*Channel:* ${data.result.name}\n`
        + `*Download Link:* ${data.result.mp3}`;

      await client.sendMessage(m.chat, {
        react: {
            text: "🕛",
            key: m.key
        }
      })
      await client.sendMessage(m.chat, {
        audio: {
            url: data.result.mp3
        },
        mimetype: "audio/mpeg",
        ptt: false,
      }, {
        quoted: m
      })
      await client.sendMessage(m.chat, {
        react: {
            text: "",
            key: m.key
        }
      })
    } catch (error) {
      console.error("YTMP3 Error:", error);
      m.reply("An error occurred while trying to download the MP3.");
    }
  },
};
