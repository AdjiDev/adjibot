// plugins/group-setting.js

module.exports = {
    name: ["group", "grup", "gc"],
    description: "Manage group settings (open/close group)",
    category: ["Groups"],
    limit: 1,
    async execute(m, client, isAdmins, isBotAdmins, isGroupOwner) {
      // Memeriksa apakah pesan berasal dari grup
      if (!m.isGroup) {
        return m.reply("This command can only be used in groups.");
      }
  
      // Memeriksa hak akses pengguna
      if (!isAdmins && !isGroupOwner) {
        return m.reply("Only group admins or the group owner can use this command.");
      }
  
      // Memeriksa apakah bot adalah admin grup
      if (!isBotAdmins) {
        return m.reply("I need to be an admin to change group settings.");
      }
  
      // Memisahkan argumen dari pesan
      const args = m.text.split(" ").slice(1); // Mengambil argumen setelah perintah
      if (args.length === 0) {
        return m.reply("Please specify 'open' or 'close' to change the group settings.");
      }
  
      // Mengatur pengaturan grup berdasarkan argumen
      try {
        if (args[0] === "close") {
          await client.groupSettingUpdate(m.chat, "announcement");
          m.reply("Success! The group is now closed. Only admins can send messages.");
        } else if (args[0] === "open") {
          await client.groupSettingUpdate(m.chat, "not_announcement");
          m.reply("Success! The group is now open. Everyone can send messages.");
        } else {
          return m.reply("Invalid argument. Please use 'open' or 'close'.");
        }
      } catch (error) {
        console.error("Error updating group settings:", error);
        m.reply("An error occurred while trying to update group settings. Please try again.");
      }
    },
  };
  