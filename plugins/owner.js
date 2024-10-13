const config = require('../config');

// Fungsi untuk format nomor telepon ke format internasional
function formatInternationalPhoneNumber(number) {
    // Pastikan nomor dimulai dengan 0 dan mengganti 0 dengan kode negara
    if (number.startsWith("0")) {
        number = "62" + number.substring(1); // Contoh untuk Indonesia, ganti "62" dengan kode negara lain jika diperlukan
    }
    return number; // Mengembalikan nomor dalam format internasional
}

module.exports = {
    name: ["owner", "contact", "creator"],
    description: "Show who is the bot creator",
    category: ["Main"],
    async execute(m, client) {
        // Pastikan config.owner terdefinisi dan dalam format yang benar
        if (!Array.isArray(config.owner) || config.owner.length === 0) {
            console.error("Owner number is not defined or invalid:", config.owner);
            return m.reply("The owner's number is not properly configured.");
        }

        // Siapkan array untuk vCard dan daftar nomor yang diformat
        const contacts = config.owner.map((number) => {
            const formattedNumber = formatInternationalPhoneNumber(number); // Format nomor
            return {
                vcard: 'BEGIN:VCARD\n' 
                    + 'VERSION:3.0\n' 
                    + `FN:${config.ownerName}\n` // Full name
                    + 'ORG:ailibytes;\n' // The organization of the contact
                    + `TEL;type=CELL;type=VOICE;waid=${formattedNumber}:${formattedNumber}\n` // WhatsApp ID + phone number
                    + 'END:VCARD'
            };
        });

        try {
            await client.sendMessage(m.chat, {
                contacts: {
                    displayName: `${config.ownerName}`,
                    contacts: contacts
                }
            }, {
                quoted: m
            });
        } catch (error) {
            console.error("Failed to send contact card:", error);
            m.reply("An error occurred while trying to send the contact card.");
        }
    },
};
