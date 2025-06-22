// SHUKRANI BOT - Settings Commands const fs = require('fs'); const configFile = './shukranicmd/configStore.json';

// Load settings let settings = {}; if (fs.existsSync(configFile)) { settings = JSON.parse(fs.readFileSync(configFile)); }

const saveSettings = () => { fs.writeFileSync(configFile, JSON.stringify(settings, null, 2)); };

const toggleSetting = async (sock, msg, command, key, emoji) => { const value = command.split(' ')[1]; const groupId = msg.key.remoteJid; if (!['yes', 'no'].includes(value)) return;

settings[key] = value; saveSettings();

await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } }); await sock.sendMessage(groupId, { text: value === 'yes' ? ✅ *${key}* is now ON. : ❌ *${key}* is now OFF. }); };

const setValue = async (sock, msg, command, key, emoji) => { const value = command.split(' ').slice(1).join(' ').trim(); const groupId = msg.key.remoteJid; if (!value) return;

settings[key] = value; saveSettings();

await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } }); await sock.sendMessage(groupId, { text: ✅ *${key}* set to: ${value} }); };

const addWarn = async (sock, groupId, userJid) => { settings.warns = settings.warns || {}; settings.warns[groupId] = settings.warns[groupId] || {}; const warns = settings.warns[groupId]; warns[userJid] = (warns[userJid] || 0) + 1;

const limit = settings.warn_limit || 3; saveSettings();

if (warns[userJid] >= limit) { try { await sock.groupParticipantsUpdate(groupId, [userJid], 'remove'); delete warns[userJid]; await sock.sendMessage(groupId, { text: 🚫 @${userJid.split('@')[0]} has been removed for reaching the warn limit., mentions: [userJid] }); } catch {} } else { await sock.sendMessage(groupId, { text: ⚠️ @${userJid.split('@')[0]} has been warned. (${warns[userJid]}/${limit}), mentions: [userJid] }); } };

module.exports = { name: 'settings', description: 'Bot configuration commands',

execute: async (sock, msg, text) => { const command = text.trim().toLowerCase(); const groupId = msg.key.remoteJid; if (!groupId.endsWith('@g.us')) return;

const toggles = {
  'alwaysonline': '🖕',
  'antibug': '🫵',
  'antical': '🤕',
  'antidelete': '🌝',
  'antideletestatus': '💝',
  'antiedit': '👀',
  'autoreactstatus': '🤗',
  'autoviewstatus': '🫣',
  'autoreact': '🫵',
  'autoread': '🙈',
  'autotype': '🐲',
  'autorecord': '⚡',
  'autorecordtyping': '🔥',
  'autoblock': '🐸',
  'chatbot': '🥰',
  'delanticallmsg': '🧑‍🦯',
  'testanticallmsg': '🧔'
};

for (const key in toggles) {
  if (command.startsWith(key)) {
    return await toggleSetting(sock, msg, command, key, toggles[key]);
  }
}

if (command === 'resetwarn') {
  settings.warns = {};
  saveSettings();
  await sock.sendMessage(groupId, { react: { text: '🤐', key: msg.key } });
  await sock.sendMessage(groupId, { text: '✅ All warnings have been reset.' });
  return;
}

if (command === 'listwarn') {
  const warns = settings.warns?.[groupId] || {};
  const entries = Object.entries(warns);
  await sock.sendMessage(groupId, { react: { text: '🥸', key: msg.key } });
  if (!entries.length) {
    return await sock.sendMessage(groupId, { text: '✅ No warnings yet.' });
  }
  const list = entries.map(([user, count]) => `• @${user.split('@')[0]} - ${count} warn(s)`).join('\n');
  await sock.sendMessage(groupId, {
    text: `⚠️ *Warnings List:*\n\n${list}`,
    mentions: entries.map(([user]) => user)
  });
  return;
}

if (command.startsWith('setwarn')) {
  const value = command.split(' ')[1];
  const num = parseInt(value);
  if (!num || isNaN(num)) {
    await sock.sendMessage(groupId, { text: '❌ Invalid value. Usage: setwarn 3' });
    return;
  }
  settings.warn_limit = num;
  saveSettings();
  await sock.sendMessage(groupId, { react: { text: '🙅', key: msg.key } });
  await sock.sendMessage(groupId, { text: `✅ Warning limit set to ${num}` });
  return;
}

if (command === 'getsettings') {
  await sock.sendMessage(groupId, { react: { text: '🫡', key: msg.key } });
  const formatted = Object.entries(settings).map(([k, v]) => `• *${k}* : ${v}`).join('\n');
  await sock.sendMessage(groupId, { text: `⚙️ *Current Settings:*\n\n${formatted}` });
  return;
}

if (command === 'resetsettings') {
  await sock.sendMessage(groupId, { react: { text: '🔁', key: msg.key } });
  settings = {
    prefix: false,
    prefixSymbol: ".",
    alwaysonline: "yes",
    antibug: "yes",
    antical: "no",
    antidelete: "no",
    antideletestatus: "no",
    antiedit: "no",
    autoreactstatus: "yes",
    autoviewstatus: "yes",
    autoreact: "no",
    autoread: "no",
    autotype: "no",
    autorecord: "no",
    autorecordtyping: "no",
    autoblock: "no",
    chatbot: "no",
    delanticallmsg: "no",
    testanticallmsg: "no",
    mode: "public",
    setstatusemoji: "🤖",
    setbotname: "SHUKRANI",
    setwatermark: "SHUKRANI • BOT",
    setstickerauthor: "SHUKRANI TEAM",
    setstickerpackname: "Shukrani Stickers",
    settimezone: "Africa/Dar_es_Salaam",
    setcontextlink: "https://wa.me/255773350309",
    setmenuimage: "https://files.catbox.moe/cqt22l.jpg"
  };
  saveSettings();
  await sock.sendMessage(groupId, { text: `♻️ *SHUKRANI settings have been reset to default.*` });
  return;
}

},

addWarn };

  
