// config.js

const fs = require("fs");
const chalk = require("chalk");

// Main config
const config = {
  ownerName: "AdjiDev",
  botName: "Automaton",
  thumbnail: "https://raw.githubusercontent.com/AdjiDev/adjibot/refs/heads/main/yoi.jpg",
  owner: ["628xxx", "628xxx"],
  website: "https://ailibytes.xyz",
  promptAi: "Your name is Aili, a smart and friendly AI assistant created by the Ailibytes team",
  prefix: ["/", "!", "."],
  // api url sets
  apiurl: {
    widipie: "https://widipe.com/"
  },
  // keys secret (optional)
  secret: {
    pastebin: "-JqHjcAhDmYosGfHFujh5rU-0-HGFAQI",
    gemini: "_",
    openai: "_"
  },

  // autoreact emoji
  emoji: ["🔥", "🗿", "🥴", "😊", "⚠️", "🙂‍↕️", "❤️", "💚", "🖤", "💘", "😻", "😍", "💌", "💕"],

  // Note ( jangan tambahkan emoji di kategori atau nanti akan error )
  category: [
    "Main",
    "Automaton",
    "Downloader",
    "Groups",
    "Tools",
    "Utility",
    "Other"
  ],
  pesan: {
    loading: "Please wait a minute . . .",
    antikasar: "Inappropriate message detected!",
    creator: "This commands only used by owner",
    error: "Error!",
  },
  // settings
  setting: {
    autoread: true,
    autoswview: true,
    antikasar: true,
    apaloh: true
  },

  kasar: /\b(babi|kontol|memek|kontl|kntl|anjing|anj|asu|ngentot|ngentd|ngtd|tolol)\b/i,
  apasih: /\b(sayang|syg|sayang|ayank|ayang|muach|muah|emuach|muach)\b/i
};
// Ekspor konfigurasi
module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});