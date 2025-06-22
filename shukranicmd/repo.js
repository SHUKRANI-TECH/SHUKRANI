const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'repo',
  description: 'Send SHUKRANI bot repository info with image and voice (if available)',

  execute: async (sock, msg) => {
    const jid = msg.key.remoteJid;

    // React to the message
    await sock.sendMessage(jid, {
      react: { text: '💯', key: msg.key }
    });

    const imageUrl = 'https://files.catbox.moe/bvy2u1.jpg';
    const caption = `
*𝐒𝐇𝐔𝐊𝐑𝐀𝐍𝐈 𝐁𝐎𝐓 𝐑𝐄𝐏𝐎*
🔗 https://github.com/SHUKRANI-TECH/SHUKRANI.git

🤙🤙🤙🤙🤙🤙
*𝐉𝐎𝐈𝐍 𝐎𝐔𝐑 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐂𝐇𝐀𝐍𝐍𝐄𝐋*
📢 https://whatsapp.com/channel/0029VbB16dt9hXEyw3bO1k0p

_𝑩𝒚 𝒔𝒉𝒖𝒌𝒓𝒂𝒏𝒊_
`.trim();

    // Send image with caption
    await sock.sendMessage(jid, {
      image: { url: imageUrl },
      caption
    });

    // Check and send audio if available
    const audioPath = path.join(__dirname, '../media/shukrani_repo.mp3');

    if (fs.existsSync(audioPath)) {
      try {
        const audioBuffer = fs.readFileSync(audioPath);
        await sock.sendMessage(jid, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: true // send as voice note
        });
      } catch (error) {
        console.error('⚠️ Error sending audio:', error.message);
      }
    }
  }
};
