module.exports = {
    name: ["console"],
    description: "Execute JavaScript code",
    category: ["System"],
    forOwner: true,
    async execute(m, client, isOwner) {
      if (!isOwner) return m.reply("This command can only be used by the owner.");
  
      const args = m.text.trim().split(/ +/).slice(1);
      const code = args.join(" ");
  
      if (!code) return m.reply("Please provide JavaScript code to execute.");
  
      try {
        const result = eval(code);
        if (result instanceof Promise) {
          result.then(res => m.reply(`Result:\n\`\`\`\n${res}\n\`\`\``))
                .catch(err => m.reply(`Error: ${err.message}`));
        } else {
          m.reply(`Result:\n\`\`\`\n${result}\n\`\`\``);
        }
      } catch (error) {
        console.error(`[ERROR] JavaScript execution failed: ${error.message}`);
        m.reply(`Error: ${error.message}`);
      }
    },
  };
  