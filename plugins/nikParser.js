const { exec } = require("child_process");
const chalk = require("chalk");
const config = require("../config");

module.exports = {
  name: ["nik"],
  description: "Parse NIK and retrieve information",
  category: ["Utility"], // Sesuaikan kategori jika diperlukan
  limit: 1,
  async execute(m, client) {
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) {
      return m.reply("Please provide a NIK.");
    }

    const nik = args[0];

    // Menjalankan skrip nik.js dengan child process
    exec(`node nik.js -n ${nik}`, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`[ ERROR ] Failed to execute nik.js: ${error.message}`));
        return m.reply("An error occurred while processing your request.");
      }

      if (stderr) {
        console.error(chalk.yellow(`[ STDERR ] ${stderr}`));
      }

      // Mengirim hasil output ke chat
      const result = stdout.trim();
      if (result) {
        m.reply(result);
      } else {
        m.reply("No information retrieved for the provided NIK.");
      }
    });
  },
};
