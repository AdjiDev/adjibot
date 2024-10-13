const fs = require("fs");
const chalk = require("chalk");
const dbPath = require("path").join(__dirname, "../database.json");
const config = require("../config");

module.exports = {
  name: ["resetlimit"],
  description: "Reset user limits to default.",
  category: ["Main"],
  forOwner: true,
  execute: async (m, client, isOwner) => {
    if (!isOwner) return m.reply("This command can only be used by the owner.");

    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      const resetData = data.map(user => {
        user.limit_left = config.default_limits; 
        return user;
      });

      fs.writeFileSync(dbPath, JSON.stringify(resetData, null, 2));
      m.reply("All user limits have been reset to the default value.");
      console.log(chalk.green("User limits have been reset by the owner."));
    } catch (err) {
      console.error(chalk.red("Error resetting limits: ", err.message));
      m.reply("Error resetting limits, please try again later.");
    }
  },
};

const resetLimitsAtMidnight = () => {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0); 
  const msUntilMidnight = nextMidnight - now;

  setTimeout(() => {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const resetData = data.map(user => {
      user.limit_left = config.default_limits; 
      return user;
    });

    fs.writeFileSync(dbPath, JSON.stringify(resetData, null, 2));
    console.log(chalk.green("User limits have been automatically reset at midnight."));
    
    resetLimitsAtMidnight();
  }, msUntilMidnight);
};

resetLimitsAtMidnight();
