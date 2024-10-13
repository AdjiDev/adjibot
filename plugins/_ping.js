const os = require("os");

module.exports = {
  name: ["ping", "sysinfo"],
  description: "Check system details and response time",
  category: ["Utility"],
  async execute(m, client) {
    try {
      // Get OS information
      const uptime = os.uptime();
      const platform = os.platform();
      const arch = os.arch();
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const nodeVersion = process.version;
      const cpuInfo = os.cpus()[0].model;
      const cpuCount = os.cpus().length;
      const osType = os.type();
      const osRelease = os.release();
      const hostname = os.hostname();

      // Format uptime
      const days = Math.floor(uptime / (24 * 60 * 60));
      const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((uptime % (60 * 60)) / 60);
      const seconds = uptime % 60;

      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Format memory
      const freeMemInMB = (freeMemory / (1024 * 1024)).toFixed(2);
      const totalMemInMB = (totalMemory / (1024 * 1024)).toFixed(2);

      // Prepare the message
      const sysInfo = `
*📊 System Info:*
• Platform: ${platform}
• OS Type: ${osType}
• OS Release: ${osRelease}
• Architecture: ${arch}
• Hostname: ${hostname}
• CPU Model: ${cpuInfo}
• CPU Cores: ${cpuCount}
• Total Memory: ${totalMemInMB} MB
• Free Memory: ${freeMemInMB} MB
• Node.js Version: ${nodeVersion}
• System Uptime: ${uptimeString}
      `;

      // Send the system info message
      await client.sendMessage(m.chat, { text: sysInfo }, { quoted: m });

    } catch (error) {
      console.error("Error in _ping.js plugin:", error);
      m.reply("An error occurred while trying to retrieve system information.");
    }
  },
};
