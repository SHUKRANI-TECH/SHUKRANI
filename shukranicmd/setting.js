// SHUKRANI BOT - Settings Commands const fs = require('fs'); const configFile = './shukranicmd/configStore.json';

// Load settings let settings = {}; if (fs.existsSync(configFile)) { settings = JSON.parse(fs.readFileSync(configFile)); }

const saveSettings = () => { fs.writeFileSync(configFile, JSON.stringify(settings, null, 2)); };

const toggleSetting = async (sock, msg, command, key, emoji) => { const value = command.split(' ')[1]; const groupId = msg.key.remoteJid; if (!['yes', 'no'].includes(value)) return;

settings[key] = value; saveSettings();

await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } }); await sock.sendMessage(groupId, { text: value === 'yes' ? ✅ *${key}* is now ON. : ❌ *${key}* is now OFF. }); };

const setValue = async (sock, msg, command, key, emoji) => { const value = command.split(' ').slice(1).join(' ').trim(); const groupId = msg.key.remoteJid; if (!value) return;

settings[key] = value; saveSettings();

await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } }); await sock.sendMessage(groupId, { text: ✅ *${key}* set to: ${value} }); };

module.exports = { name: 'settings', description: 'Bot configuration commands',

execute: async (sock, msg, text) => { const command = text.trim().toLowerCase(); const groupId = msg.key.remoteJid; if (!groupId.endsWith('@g.us')) return;

// Toggle settings
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
    return await

  
