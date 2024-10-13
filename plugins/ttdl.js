const config = require("../config");
const axios = require("axios");

module.exports = {
  name: ["tt", "tiktok", "ttmp4", "tiktokdl"],
  description: "Download TikTok videos",
  category: ["Downloader"],
  limit: 1,
  async execute(m, client) {
    const args = m.text.split(" ");
    const url = args[1]; // Menganggap URL ada di argumen kedua

    if (!url) {
      return m.reply("Please provide a TikTok video URL.");
    }

    try {
      const response = await axios.get(
        `${config.apiurl.widipie}/download/tiktokdl?url=${encodeURIComponent(
          url
        )}`
      );

      if (response.data.status && response.data.result.status) {
        const videoUrl = response.data.result.video; // URL video
        const wmUrl = response.data.result.wm; // URL watermark (jika perlu)
        const musicUrl = response.data.result.music; // URL musik (jika perlu)

        await client.sendMessage(m.chat, {
          react: {
            text: "🕛",
            key: m.key
          }
        })
        await client.sendMessage(m.chat, {
          video: {
            url: videoUrl,
          },
          caption: `${url}`, // Menambahkan keterangan
        }, {
            quoted: m
        });
        await client.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key
          }
        })
      } else {
        // Mengirim pesan kesalahan berdasarkan data respons
        const errorMsg =
          response.data.message ||
          "Failed to download the TikTok video. Please try again later.";
        m.reply(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching TikTok video:", error);
      const errorMsg =
        error.response?.data?.message ||
        "An error occurred while trying to download the TikTok video.";
      m.reply(errorMsg);
    }
  },
};
