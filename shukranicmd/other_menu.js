// SHUKRANI BOT - Other Menu Commands
const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'othermenu',
  description: 'Miscellaneous bot commands like ping, runtime, repo, etc.',

  execute: async (sock, msg, text) => {
    const command = text.trim().toLowerCase();
    const groupId = msg.key.remoteJid;

    const react = async (emoji) => {
      await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } });
    };

    if (command === 'ping') {
      const start = Date.now();
      await react('🤒');
      await sock.sendMessage(groupId, { text: `🏓 Pong! Response time: ${Date.now() - start} ms.` });
    }

    else if (command === 'runtime') {
      await react('👀');
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      await sock.sendMessage(groupId, { text: `⏱ Bot uptime: ${hours}h ${minutes}m ${seconds}s` });
    }

    else if (command === 'botstatus') {
      await sock.sendMessage(groupId, { text: `🤖 Bot is online and working fine.` });
    }

    else if (command === 'pair') {
      const groupMetadata = await sock.groupMetadata(groupId);
      const members = groupMetadata.participants.filter(p => p.id !== msg.key.participant);
      const pair1 = members[Math.floor(Math.random() * members.length)];
      const pair2 = members[Math.floor(Math.random() * members.length)];
      await sock.sendMessage(groupId, {
        text: `❤️ Today's random pair: @${pair1.id.split('@')[0]} ❤️ @${pair2.id.split('@')[0]}`,
        mentions: [pair1.id, pair2.id]
      });
    }

    else if (command === 'repo') {
      await react('💯');
      const caption = `*𝐒𝐇𝐔𝐊𝐑𝐀𝐍𝐈 𝐁𝐎𝐓 𝐑𝐄𝐏𝐎*

🔗 https://github.com/SHUKRANI-TECH/SHUKRANI.git

🤙 Join Official Channel:
📢 https://whatsapp.com/channel/0029VbB16dt9hXEyw3bO1k0p

_By Shukrani_`;
      await sock.sendMessage(groupId, {
        image: { url: 'https://files.catbox.moe/bvy2u1.jpg' },
        caption
      });

      const audioPath = path.join(__dirname, '../media/shukrani_repo.mp3');
      if (fs.existsSync(audioPath)) {
        const audioBuffer = fs.readFileSync(audioPath);
        await sock.sendMessage(groupId, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: true
        });
      }
    }

    else if (command === 'time') {
      const date = new Date();
      const timeString = date.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });
      await sock.sendMessage(groupId, { text: `🕒 Current bot time: ${timeString}` });
    }

    else if (command === 'developer') {
      await sock.sendMessage(groupId, {
        text: `👨‍💻 *Developer Info:*\n\n📞 WhatsApp: wa.me/255773350309\n💬 Name: SHUKRANI`
      });
    }
  }
};
