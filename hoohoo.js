const config = require("./config");
const fs = require("fs");
const chalk = require("chalk")
const { delay } = require('@whiskeysockets/baileys')
const KasarPattern = config.kasar;
const apasihPattern = config.apasih

module.exports = async (client, m, chatUpdate, store) => {
  try {
    const text = m.text || '';

    if (config.setting.autoread) {
      if(text) {
        await client.readMessages([m.key])
      }
    }

    if (config.setting.antikasar) {
      if (KasarPattern.test(text)) {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        });

        await client.sendPresenceUpdate('composing', m.chat)
        delay(1800)
        await m.reply(`${config.pesan.antikasar}`)
        return;
      }
    }

    if (config.setting.apaloh) {
      if (apasihPattern.test(text)) {
        let audios = fs.readFileSync('./media/sound/suki.mp3')
        await client.sendPresenceUpdate('recording', m.chat)
        delay(1800)
        await client.sendMessage(m.chat, {
          audio: audios,
          mimetype: 'audio/mpeg',
          ptt: true
        }, {
          quoted: m
        })
        return;
      }
    }

  } catch (err) {
    console.error("Error di hoohoo.js:", err);
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});