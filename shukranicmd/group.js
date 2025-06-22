// SHUKRANI BOT - Group Commands const fs = require('fs'); const { downloadMediaMessage } = require('@adiwajshing/baileys');

const groupSettings = require('./groupConfig.json'); const welcomeState = {}; const goodbyeState = {};

module.exports = { name: 'group', description: 'All group commands merged into one file',

execute: async (sock, msg, text) => { const groupId = msg.key.remoteJid; const senderId = msg.key.participant || msg.key.remoteJid; const groupMetadata = await sock.groupMetadata(groupId); const isAdmin = groupMetadata.participants.find(p => p.id === senderId)?.admin; const participants = groupMetadata.participants.map(p => p.id); const command = text.trim().toLowerCase();

if (!groupId.endsWith('@g.us')) return;

const react = async (⚡) => await sock.sendMessage(groupId, { react: { text: '🙋', key: msg.key } });

if (command === 'tagall') {
  await react(🌠);
  let message = '*👥 Group Members:*';
  for (let user of participants) message += `\n@${user.split('@')[0]}`;
  await sock.sendMessage(groupId, { text: message, mentions: participants });
}

else if (command === 'getallmembers') {
  await react(🙈);
  const links = participants.map(p => `wa.me/${p.split('@')[0]}`);
  await sock.sendMessage(groupId, { text: `📱 *Group Members Links:*\n\n${links.join('\n')}` });
}

else if (command.startsWith('htag')) {
  await react(🐸);
  const content = text.replace(/^htag\s*/i, '') || '📢 Message to all members';
  await sock.sendMessage(groupId, { text: content, mentions: participants });
}

else if (command === 'promoteall') {
  await react(🐲);
  for (const member of participants) {
    try {
      await sock.groupParticipantsUpdate(groupId, [member], 'promote');
    } catch {}
  }
  await sock.sendMessage(groupId, { text: '✅ All members promoted.' });
}

else if (command === 'kick' || command === 'remove') {
  await react(🐀);
  if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
    const target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    await sock.groupParticipantsUpdate(groupId, [target], 'remove');
    await sock.sendMessage(groupId, { text: `🦶 Removed ${target}` });
  } else {
    await sock.sendMessage(groupId, { text: '❌ Please mention someone to kick.' });
  }
}

else if (command === 'groupicon') {
  await react(🫧);
  const icon = groupMetadata?.groupImage || null;
  if (icon) {
    await sock.sendMessage(groupId, { image: { url: icon }, caption: '🖼 Group Icon' });
  } else {
    await sock.sendMessage(groupId, { text: '❌ Group icon not found.' });
  }
}

else if (command === 'link') {
  await react(🏄);
  const code = await sock.groupInviteCode(groupId);
  await sock.sendMessage(groupId, { text: `🔗 Group Link:\nhttps://chat.whatsapp.com/${code}` });
}

else if (command === 'shukranikillgroup') {
  await react(🔥);
  if (!groupMetadata.owner || groupMetadata.owner !== senderId) {
    await sock.sendMessage(groupId, { text: '❌ Only group owner can use this command.' });
    return;
  }
  const members = participants.filter(p => p !== senderId);
  for (const member of members) {
    try {
      await sock.groupParticipantsUpdate(groupId, [member], 'remove');
    } catch {}
  }
  const code = await sock.groupInviteCode(groupId);
  await sock.sendMessage(groupId, { text: `🧹 Group cleaned. New link:\nhttps://chat.whatsapp.com/${code}` });
}

else if (command === 'welcome on') {
  await react(🥰);
  welcomeState[groupId] = true;
  await sock.sendMessage(groupId, { text: '👋 Welcome message enabled.' });
}

else if (command === 'welcome off') {
  await react(🌝);
  delete welcomeState[groupId];
  await sock.sendMessage(groupId, { text: '🔕 Welcome message disabled.' });
}

else if (command === 'goodbye on') {
  await react(🌚);
  goodbyeState[groupId] = true;
  await sock.sendMessage(groupId, { text: '👋 Goodbye message enabled.' });
}

else if (command === 'goodbye off') {
  await react(🧐);
  delete goodbyeState[groupId];
  await sock.sendMessage(groupId, { text: '🔕 Goodbye message disabled.' });
}

},

onGroupParticipantsUpdate: async (sock, update) => { const groupId = update.id; for (const participant of update.participants) { if (update.action === 'add' && welcomeState[groupId]) { await sock.sendMessage(groupId, { text: 👋 Welcome @${participant.split('@')[0]}, mentions: [participant] }); } else if (update.action === 'remove' && goodbyeState[groupId]) { await sock.sendMessage(groupId, { text: 👋 Goodbye @${participant.split('@')[0]}, mentions: [participant] }); } } } };

    
