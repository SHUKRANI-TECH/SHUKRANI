// SHUKRANI BOT - Group Commands const fs = require('fs'); const { downloadMediaMessage } = require('@adiwajshing/baileys');

const groupSettings = require('./groupConfig.json'); const welcomeState = {}; const goodbyeState = {}; const whitelist = new Set(groupSettings.whitelist || []);

const saveGroupSettings = () => { groupSettings.whitelist = [...whitelist]; fs.writeFileSync('./shukranicmd/groupConfig.json', JSON.stringify(groupSettings, null, 2)); };

module.exports = { name: 'group', description: 'All group commands merged into one file',

execute: async (sock, msg, text) => { const groupId = msg.key.remoteJid; const senderId = msg.key.participant || msg.key.remoteJid; const groupMetadata = await sock.groupMetadata(groupId); const isAdmin = groupMetadata.participants.find(p => p.id === senderId)?.admin; const participants = groupMetadata.participants.map(p => p.id); const command = text.trim().toLowerCase();

if (!groupId.endsWith('@g.us')) return;

const react = async (emoji) => await sock.sendMessage(groupId, { react: { text: emoji, key: msg.key } });

if (command === 'tagall') {
  await react('🌠');
  let message = '*👥 Group Members:*';
  for (let user of participants) message += `\n@${user.split('@')[0]}`;
  await sock.sendMessage(groupId, { text: message, mentions: participants });
} else if (command === 'getallmembers') {
  await react('🙈');
  const links = participants.map(p => `wa.me/${p.split('@')[0]}`);
  await sock.sendMessage(groupId, { text: `📱 *Group Members Links:*\n\n${links.join('\n')}` });
} else if (command.startsWith('htag')) {
  await react('🐸');
  const content = text.replace(/^htag\s*/i, '') || '📢 Message to all members';
  await sock.sendMessage(groupId, { text: content, mentions: participants });
} else if (command === 'promoteall') {
  await react('🐲');
  for (const member of participants) {
    try {
      await sock.groupParticipantsUpdate(groupId, [member], 'promote');
    } catch {}
  }
  await sock.sendMessage(groupId, { text: '✅ All members promoted.' });
} else if (command === 'kick' || command === 'remove') {
  await react('🐀');
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!mentioned) return await sock.sendMessage(groupId, { text: '❌ Please mention someone to kick.' });
  await sock.groupParticipantsUpdate(groupId, [mentioned], 'remove');
  await sock.sendMessage(groupId, { text: `🦶 Removed @${mentioned.split('@')[0]}`, mentions: [mentioned] });
} else if (command === 'groupicon') {
  await react('🫧');
  const icon = groupMetadata?.groupImage || null;
  if (icon) {
    await sock.sendMessage(groupId, { image: { url: icon }, caption: '🖼 Group Icon' });
  } else {
    await sock.sendMessage(groupId, { text: '❌ Group icon not found.' });
  }
} else if (command === 'link') {
  await react('🏄');
  const code = await sock.groupInviteCode(groupId);
  await sock.sendMessage(groupId, { text: `🔗 Group Link:\nhttps://chat.whatsapp.com/${code}` });
} else if (command === 'shukranikillgroup') {
  await react('🔥');
  if (!groupMetadata.owner || groupMetadata.owner !== senderId) {
    return await sock.sendMessage(groupId, { text: '❌ Only group owner can use this command.' });
  }
  const members = participants.filter(p => p !== senderId);
  for (const member of members) {
    try {
      await sock.groupParticipantsUpdate(groupId, [member], 'remove');
    } catch {}
  }
  const code = await sock.groupInviteCode(groupId);
  await sock.sendMessage(groupId, { text: `🧹 Group cleaned. New link:\nhttps://chat.whatsapp.com/${code}` });
} else if (command === 'welcome on') {
  await react('🥰');
  welcomeState[groupId] = true;
  await sock.sendMessage(groupId, { text: '👋 Welcome message enabled.' });
} else if (command === 'welcome off') {
  await react('🌝');
  delete welcomeState[groupId];
  await sock.sendMessage(groupId, { text: '🔕 Welcome message disabled.' });
} else if (command === 'goodbye on') {
  await react('🌚');
  goodbyeState[groupId] = true;
  await sock.sendMessage(groupId, { text: '👋 Goodbye message enabled.' });
} else if (command === 'goodbye off') {
  await react('🧐');
  delete goodbyeState[groupId];
  await sock.sendMessage(groupId, { text: '🔕 Goodbye message disabled.' });
} else if (command === 'antilinkkick on') {
  await react('🏊');
  groupSettings.antilinkkick = groupSettings.antilinkkick || {};
  groupSettings.antilinkkick[groupId] = true;
  fs.writeFileSync('./shukranicmd/groupConfig.json', JSON.stringify(groupSettings, null, 2));
  await sock.sendMessage(groupId, { text: '🔗 Antilinkkick enabled.' });
} else if (command === 'antilinkkick off') {
  await react('🛀');
  if (groupSettings.antilinkkick) delete groupSettings.antilinkkick[groupId];
  fs.writeFileSync('./shukranicmd/groupConfig.json', JSON.stringify(groupSettings, null, 2));
  await sock.sendMessage(groupId, { text: '🚫 Antilinkkick disabled.' });
} else if (command.startsWith('addwhitelistuser')) {
  await react('🤒');
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!mentioned) return await sock.sendMessage(groupId, { text: '❌ Mention a user to whitelist.' });
  whitelist.add(mentioned);
  saveGroupSettings();
  await sock.sendMessage(groupId, { text: `✅ User @${mentioned.split('@')[0]} added to whitelist.`, mentions: [mentioned] });
} else if (command.startsWith('removewhitelistuser')) {
  await react('➖');
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!mentioned) return await sock.sendMessage(groupId, { text: '❌ Mention a user to remove from whitelist.' });
  whitelist.delete(mentioned);
  saveGroupSettings();
  await sock.sendMessage(groupId, { text: `🗑️ User @${mentioned.split('@')[0]} removed from whitelist.`, mentions: [mentioned] });
} else if (command === 'listwhitelist') {
  await react('👀');
  if (whitelist.size === 0) return await sock.sendMessage(groupId, { text: '📭 No users in whitelist.' });
  const list = [...whitelist].map(id => `• @${id.split('@')[0]}`).join('\n');
  await sock.sendMessage(groupId, { text: `📋 *Whitelist Members:*\n\n${list}`, mentions: [...whitelist] });
}

},

onGroupParticipantsUpdate: async (sock, update) => { const groupId = update.id; for (const participant of update.participants) { if (update.action === 'add' && welcomeState[groupId]) { await sock.sendMessage(groupId, { text: 👋 Welcome @${participant.split('@')[0]}, mentions: [participant] }); } else if (update.action === 'remove' && goodbyeState[groupId]) { await sock.sendMessage(groupId, { text: 👋 Goodbye @${participant.split('@')[0]}, mentions: [participant] }); } } },

onMessage: async (sock, msg) => { const groupId = msg.key.remoteJid; const sender = msg.key.participant || msg.key.remoteJid; const isGroup = groupId.endsWith('@g.us'); if (!isGroup) return;

const groupMetadata = await sock.groupMetadata(groupId);
const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

if (groupSettings.antilinkkick?.[groupId]) {
  const textMsg = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  const linkRegex = /https?:\/\/[\w.-]+/i;

  if (linkRegex.test(textMsg)) {
    if (!whitelist.has(sender) && !isAdmin) {
      setTimeout(async () => {
        try {
          await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
        } catch (err) {
          console.log('❌ Failed to remove user sending link:', err.message);
        }
      }, 1000);
    }
  }
}

} };

  
