const fs = require('fs');
const path = require('path');

const whitelistPath = path.join(__dirname, '..', 'whitelist.json');

function loadWhitelist() {
  try {
    return JSON.parse(fs.readFileSync(whitelistPath));
  } catch {
    return [];
  }
}

function saveWhitelist(data) {
  fs.writeFileSync(whitelistPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'whitelist',
  description: 'Add, remove or view numbers in the antilink whitelist (admin only)',

  execute: async (sock, msg, text) => {
    const groupId = msg.key.remoteJid;
    const senderId = msg.key.participant || msg.key.remoteJid;

    if (!groupId.endsWith('@g.us')) {
      await sock.sendMessage(groupId, { text: '❌ This command works only in groups.' });
      return;
    }

    const groupMetadata = await sock.groupMetadata(groupId);
    const isAdmin = groupMetadata.participants.find(p => p.id === senderId)?.admin;

    if (!isAdmin) {
      await sock.sendMessage(groupId, { text: '❌ Only group admins can use this command.' });
      return;
    }

    const args = text.trim().split(/\s+/);
    const action = args[1];
    const number = args[2];

    let whitelist = loadWhitelist();

    if (action === 'add') {
      if (!number) return await sock.sendMessage(groupId, { text: '⚠️ Please provide a number.' });
      if (whitelist.includes(number)) {
        await sock.sendMessage(groupId, { text: `ℹ️ ${number} is already whitelisted.` });
      } else {
        whitelist.push(number);
        saveWhitelist(whitelist);
        await sock.sendMessage(groupId, { text: `✅ ${number} added to whitelist.` });
      }
    }

    else if (action === 'remove') {
      if (!number) return await sock.sendMessage(groupId, { text: '⚠️ Please provide a number.' });
      if (!whitelist.includes(number)) {
        await sock.sendMessage(groupId, { text: `ℹ️ ${number} is not in the whitelist.` });
      } else {
        whitelist = whitelist.filter(n => n !== number);
        saveWhitelist(whitelist);
        await sock.sendMessage(groupId, { text: `❎ ${number} removed from whitelist.` });
      }
    }

    else if (action === 'list') {
      if (whitelist.length === 0) {
        await sock.sendMessage(groupId, { text: '📭 Whitelist is currently empty.' });
      } else {
        const list = whitelist.map(n => `• ${n}`).join('\n');
        await sock.sendMessage(groupId, { text: `📋 *Whitelisted Numbers:*\n${list}` });
      }
    }

    else {
      await sock.sendMessage(groupId, {
        text: `⚙️ Usage:\n.whitelist add 255712345678\n.whitelist remove 255712345678\n.whitelist list`
      });
    }
  }
};
