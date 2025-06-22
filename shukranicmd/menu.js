// SHUKRANI BOT - Menu with Logo
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./shukranicmd/configStore.json'));

module.exports = {
  name: 'menu',
  description: 'Display all bot features',

  execute: async (sock, msg, text) => {
    const groupId = msg.key.remoteJid;

    const menu = `
╭───╼ *𝕊ℍ𝕌𝕂ℝ𝔸ℕ𝕀 𝔹𝕆𝕋 𝕄𝔼ℕ𝕌*
│
├─ 💬 *GROUP COMMANDS*
│ • tagall
│ • htag <msg>
│ • getallmembers
│ • antitag yes/no
│ • antibot yes/no
│ • antimentiongroup yes/no
│ • totalmember
│ • tagadmin
│ • kickall
│ • promote @user
│ • demote @user
│ • open / close
│ • resentlink
│ • vv
│ • save
│
├─ 📥 *DOWNLOAD COMMANDS*
│ • ytmp3 / ytmp4
│ • tiktok / tiktokaudio
│ • play / play2
│ • song / song2
│ • facebook
│ • instagram
│ • image
│ • gdrive
│ • mediafire
│ • pinterest
│ • apk
│ • itunes
│ • xvideos
│ • gitclone
│ • shukrani
│ • savestatus
│ • telesticker
│ • video / videodoc
│
├─ 🌐 *SEARCH COMMANDS*
│ • google <query>
│
├─ ⚙️ *SETTINGS COMMANDS*
│ • alwaysonline yes/no
│ • autoblock yes/no
│ • chatbot yes/no
│ • getsettings
│ • resetsettings
│ • setbotname <name>
│ • settimezone <zone>
│ • setmenuimage <url>
│
├─ 🔧 *OWNER COMMANDS*
│ • block @user
│ • unblock @user
│ • unblockall
│ • delete
│ • deljunk
│ • disk
│ • dlvo
│ • gcaddprivacy yes/no
│ • groupid
│ • hostip
│ • join <link>
│ • lastseen @user
│ • leave
│ • listblocked
│ • listignorelist
│ • listsudo
│ • modestatus
│ • owner
│ • ppprivacy yes/no
│ • react 🤖
│ • readreceipts yes/no
│ • restart
│ • setprofilepic
│ • setstickercmd / delstickercmd
│ • tostatus <msg>
│ • toviewonce <media>
│ • warn @user
│
├─ 🔎 *OTHER COMMANDS*
│ • ping
│ • runtime
│ • botstatus
│ • pair
│ • repo
│ • time
│ • developer
│ • system
╰─────╼ _By SHUKRANI ☪︎_
    `;

    await sock.sendMessage(groupId, {
      image: { url: config.setmenuimage },
      caption: menu,
    });
  }
};
