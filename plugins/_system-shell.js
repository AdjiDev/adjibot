const { exec } = require("child_process");

module.exports = {
  name: ["shell"],
  description: "Execute shell commands",
  category: ["System"],
  forOwner: true,
  async execute(m, client, isOwner) {
    if (!isOwner) return m.reply("This command can only be used by the owner.");

    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) return m.reply("Please provide a command to execute.");

    const command = args.join(" ");

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[ERROR] Shell command failed: ${error.message}`);
        return m.reply(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`[STDERR] Shell command error: ${stderr}`);
        return m.reply(`Error: ${stderr}`);
      }
      m.reply(`Output:\n\`\`\`${stdout}\n\`\`\``);
    });
  },
};
