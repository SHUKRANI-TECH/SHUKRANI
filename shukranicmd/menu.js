module.exports = {
  name: 'menu',
  description: 'Display all bot features',

  execute: async (sock, msg, text) => {
    const jid = msg.key.remoteJid;
    const botNumber = sock.user.id;

    // Logo  SHUKRANI BOT
    const ppUrl = 'https://files.catbox.moe/bvy2u1.jpg';

    const menu = `
╭───❖ *🤖 SHUKRANI BOT* ❖───╮
│ 👋 MENU SHUKRANI IS AVAILABLE 
╰──────────────────────────╯

╭─❖ *GROUP COMMANDS* ❖─╮
│ 👑 promoteall
│ 🔗 link
│ 👋 welcome
│ 👋 goodbye
│ 🦶 kick / remove
│ 🖼️ groupicon
│ 💀 shukranikillgroup
│ 🚫 antilinkkick
│ 🟢 addwhitelistuser
│ 🔴 removewhitelistuser
│ 📜 listwhitelist
╰────────────────────╯

╭─❖ *OWNER COMMANDS* ❖─╮
│ 🛠️ isOwner yes
│ 🛠️ isOwner no
│ 🆔 setbotname
│ 🌐 settimezone
│ 🧠 getsettings
│ ♻️ resetsettings
╰────────────────────╯

╭─❖ *DOWNLOADERS* ❖─╮
│ 🎵 ytmp3
│ 🎥 tiktok
╰──────────────────╯

╭─❖ *SEARCH & TOOLS* ❖─╮
│ 🔍 google
│ 🗃️ other
│ 💾 download
╰────────────────────╯

╭─❖ *SYSTEM TOGGLES* ❖─╮
│ 🟢 alwaysonline yes/no
│ 🛡️ antibug yes/no
│ 🔒 mode public/private
│ ❌ autoreact yes/no
│ 🧹 autoswclean yes/no
╰─────────────────────╯
`;

    // Tuma reaction ya 🙋
    await sock.sendMessage(jid, { react: { text: '🙋', key: msg.key } });

    // Tuma logo kama picha na menyu kama caption
    await sock.sendMessage(jid, {
      image: { url: ppUrl },
      caption: menu
    }, { quoted: msg });
  }
};
