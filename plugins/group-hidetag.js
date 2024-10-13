const config = require("../config"); // Mengimpor konfigurasi

module.exports = {
  name: ["h", "hidetag"],
  description: "Send an announcement to all group members",
  category: ["Groups"],
  limit: 1,
  async execute(m, client, isAdmins, isBotAdmins, isGroupOwner, isOwner) {
    // Cek apakah ini adalah grup
    if (!m.isGroup) return m.reply("This command can only be used in groups.");

    // Cek apakah pengirim adalah admin atau pemilik grup
    if (!isAdmins && !isGroupOwner && !isOwner) {
      return m.reply("Only admins or group owners can use this command.");
    }

    // Cek apakah bot adalah admin grup
    if (!isBotAdmins) {
      return m.reply("The bot must be an admin to send announcements.");
    }

    // Mengambil peserta grup
    const groupMetadata = await client.groupMetadata(m.chat);
    const participants = groupMetadata.participants;

    // Mengambil teks pesan setelah perintah
    const args = m.text.trim().split(/ +/).slice(1);
    const announcementText = args.join(" ") || "Admins tag all members"; // Pesan default jika tidak ada teks

    // Mengirim pesan pengumuman
    await client.sendMessage(
      m.chat,
      {
        text: announcementText,
        mentions: participants.map((a) => a.id), // Menyebutkan semua anggota grup
      },
      { quoted: m } // Menyertakan pesan yang diacu
    );
  },
};
