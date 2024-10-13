// plugins/dnslookup.js
const fetch = require("node-fetch");
const config = require("../config");

module.exports = {
  name: ["dnslookup", "dns"],
  description: "Performs a DNS lookup",
  category: ["Utility"],
  limit: 1,
  async execute(m, client) {
    // Mengambil domain dari argumen pengguna
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) {
      return m.reply("Please provide a domain name to look up.");
    }

    const domain = args[0];
    const url = `https://dns.google/resolve?name=${domain}&type=A`; // URL untuk DNS lookup

    try {
      // Melakukan request ke Google DNS API
      const response = await fetch(url);
      const data = await response.json();

      // Memeriksa apakah ada hasil
      if (!data.Answer || data.Answer.length === 0) {
        return m.reply(`No DNS records found for ${domain}.`);
      }

      // Membuat teks hasil lookup
      let resultText = `DNS Lookup for *${domain}*:\n\n`;
      data.Answer.forEach((answer) => {
        resultText += `Record: ${answer.data}\nTTL: ${answer.TTL}\n\n`;
      });

      // Mengirim hasil ke chat
      await client.sendMessage(m.chat, { text: resultText }, { quoted: m });
    } catch (error) {
      console.error("DNS Lookup Error:", error);
      m.reply(`${config.pesan.error}`);
    }
  },
};
