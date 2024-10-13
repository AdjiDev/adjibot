const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const path = require("path");
const config = require("./config");
const ora = require("ora");
const { getGroupAdmins } = require("./lib/extra");
var pkg = require('./package.json')

let pluginFolder = path.join(__dirname, "plugins");
let pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
const dbPath = path.join(__dirname, "database.json");
const botDataPath = path.join(__dirname, "bot_data.json"); // Path ke bot_data.json

// Memuat data bot
let botData = {};

// Fungsi untuk memuat data bot dari bot_data.json
async function loadBotData() {
    try {
        const data = fs.readFileSync(botDataPath, "utf-8");
        botData = JSON.parse(data)[0].bot; // Ambil objek bot dari array
    } catch (err) {
        console.error(chalk.red("Error loading bot data: ", err.message));
        botData = {
            name: "Automaton",
            version: `${pkg.version}`,
            prefix: config.prefix,
            autoread: false,
            autoswview: true,
            antikasar: true,
            apaloh: true
        }; // Default values jika terjadi kesalahan
    }
}

async function initialize() {
  await loadBotData(); // Memuat data bot
  await loadPlugins();  // Memuat plugins
}

initialize();

async function loadPlugins() {
  const spinner = ora("Loading plugins...").start();
  try {
    let pluginsCount = 0;
    for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
      try {
        global.plugins[filename] = require(path.join(pluginFolder, filename));
        spinner.succeed(`Loaded plugin: ${filename}`);
        pluginsCount++;
      } catch (e) {
        spinner.fail(`Failed to load plugin: ${filename}`);
        console.error(chalk.red(`Error: ${e.message}`));
        delete global.plugins[filename];
      }
    }
    spinner.succeed(`${pluginsCount} plugins loaded successfully.`);
  } catch (error) {
    spinner.fail("Error loading plugins.");
    console.error(chalk.red(`Error: ${error.message}`));
  }
}

async function getUserLimit(number) {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const user = data.find((u) => u.number === number);
  return user ? user.limit_left : null;
}

async function updateUserLimit(number, limit) {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const userIndex = data.findIndex((u) => u.number === number);
  if (userIndex !== -1) {
    data[userIndex].limit_left = limit;
  } else {
    data.push({ number: number, limit_left: config.default_limits });
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

(async () => {
  await loadBotData(); // Memuat data bot
  await loadPlugins(); // Memuat plugins
})();

module.exports = handler = async (client, m, chatUpdate) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype === "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype === "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype === "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype === "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype === "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype === "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : "";

    if (m.mtype === "viewOnceMessageV2") return;

    var budy = typeof m.text === "string" ? m.text : "";
    const msg = chatUpdate.messages[0];
    console.log("Message body:", body);
    const prefix = config.prefix.find((p) => body.startsWith(p)) || "/";

    const isCmd = body.startsWith(prefix);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const text = (q = args.join(" "));
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const creator = config.owner;
    const isOwner = [botNumber, ...creator]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const itsMe = m.sender === botNumber;
    const misc = m.quoted || m;
    const quoted =
      misc.mtype == "buttonsMessage"
        ? misc[Object.keys(misc)[1]]
        : misc.mtype == "templateMessage"
        ? misc.hydratedTemplate[Object.keys(misc.hydratedTemplate)[1]]
        : misc.mtype == "product"
        ? misc[Object.keys(misc)[0]]
        : m.quoted
        ? m.quoted
        : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch((e) => {
          console.error(
            chalk.red(`Failed to get group metadata: ${e.message}`)
          );
          return null;
        })
      : null;
    const groupName = m.isGroup ? groupMetadata?.subject : "";
    const participants = m.isGroup ? groupMetadata?.participants : [];
    const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : [];
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const groupOwner = m.isGroup ? groupMetadata?.owner : "";
    const isGroupOwner = m.isGroup
      ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
      : false;

    let argsLog =
      budy.length > 30 ? `${args.join(" ").substring(0, 30)}...` : budy;
    console.log(
      chalk.black(chalk.bgWhite("[ LOGS ]")),
      chalk.green(argsLog),
      chalk.magenta("From"),
      chalk.green(pushname),
      chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
    );

    if (isCmd) {
      const plugin = Object.values(global.plugins).find(
        (p) => Array.isArray(p.name) && p.name.includes(command)
      );
      if (plugin) {
        let userLimit = await getUserLimit(m.sender);
        if (userLimit === null) {
          await updateUserLimit(m.sender, config.default_limits);
          userLimit = config.default_limits;
        }

        if (plugin.limit && userLimit <= 0) {
          return m.reply("Your limit has been exceeded.");
        }

        await plugin.execute(
          m,
          client,
          isOwner,
          pushname,
          isAdmins,
          isBotAdmins,
          isGroupOwner,
          body,
          quoted,
          mime,
          prefix,
          command
        );

        if (plugin.limit) {
          await updateUserLimit(m.sender, userLimit - plugin.limit);
        }
      } else {
        console.log(
          chalk.black(chalk.bgRed("[ ERROR ]")),
          chalk.red("Command not available: "),
          chalk.green(`${prefix}${command}`)
        );
      }
    }
  } catch (err) {
    console.log(
      chalk.black(chalk.bgRed("[ ERROR ]")),
      chalk.red(util.format(err))
    );
  }
};

global.reload = (_event, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename);

    if (dir in require.cache) {
      if (!fs.existsSync(dir)) {
        console.warn(chalk.yellow(`Deleted plugin '${filename}'`));
        delete global.plugins[filename];
        return delete require.cache[dir];
      } else {
        delete require.cache[dir];
        console.log(chalk.cyan(`Requiring plugin '${filename}'`));
      }
    } else {
      console.log(chalk.cyan(`Requiring new plugin '${filename}'`));
    }

    try {
      global.plugins[filename] = require(dir);
    } catch (e) {
      console.error(
        chalk.red(`Error loading plugin '${filename}': ${e.message}`)
      );
    }
  }
};

Object.freeze(global.reload);
fs.watch(pluginFolder, global.reload);

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
