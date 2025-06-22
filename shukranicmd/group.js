const fs = require('fs');
const path = require('path');
const groupConfigPath = path.join(__dirname, '..', 'groupConfig.json');

// Load or initialize config
function loadConfig() {
  if (!fs.existsSync(groupConfigPath)) return { welcome: {}, goodbye: {} };
  return JSON.parse(fs.readFileSync(groupConfigPath));
}
function saveConfig(config) {
  fs.writeFileSync(groupConfigPath, JSON.stringify(config, null, 2));
}

async function react(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    react: {
      text: "🙋",
      key: msg.key
    }
  });
}

module.exports = {
  name: '.group',
  description: 'Group management commands',
  execute: async (sock, msg, text) => {
    const groupId = msg.key.remoteJid;
    const senderId = msg.key.participant || msg.key.remoteJid;
    const command = text.split(" ")[1]?.toLowerCase();
    const args = text.split(" ").slice(2);

    if (!groupId.endsWith('@g.us')) {
      await sock.sendMessage(groupId, { text: '❌ Group-only command.' });
      return;
    }

    const groupMetadata = await sock.groupMetadata(groupId);
    const isAdmin = groupMetadata.participants.find(p => p.id === senderId)?.admin;
    const isOwner = senderId === groupMetadata.owner;

    let config = loadConfig();

    // promoteall
    if (command === 'promoteall' && isAdmin) {
      for (const p of groupMetadata.participants) {
        if (!p.admin) await sock.groupParticipantsUpdate(groupId, [p.id], 'promote');
      }
      await sock.sendMessage(groupId, { text: '✅ All members promoted to admin.' });
      await react(sock, msg);
    }

    // link
    else if (command === 'link') {
      const code = await sock.groupInviteCode(groupId);
      await sock.sendMessage(groupId, { text: `🔗 Group Link:\nhttps://chat.whatsapp.com/${code}` });
      await react(sock, msg);
    }

    // welcome
    else if (command === 'welcome') {
      const state = args[0]?.toLowerCase();
      if (state === 'on') {
        config.welcome[groupId] = true;
        saveConfig(config);
        await sock.sendMessage(groupId, { text: '✅ Welcome enabled.' });
        await react(sock, msg);
      } else if (state === 'off') {
        config.welcome[groupId] = false;
        saveConfig(config);
        await sock.sendMessage(groupId, { text: '❎ Welcome disabled.' });
        await react(sock, msg);
      }
    }

    // goodbye
    else if (command === 'goodbye') {
      const state = args[0]?.toLowerCase();
      if (state === 'on') {
        config.goodbye[groupId] = true;
        saveConfig(config);
        await sock.sendMessage(groupId, { text: '✅ Goodbye enabled.' });
        await react(sock, msg);
      } else if (state === 'off') {
        config.goodbye[groupId] = false;
        saveConfig(config);
        await sock.sendMessage(groupId, { text: '❎ Goodbye disabled.' });
        await react(sock, msg);
      }
    }

    // kick/remove
    else if ((command === 'kick' || command === 'remove') && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      const target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (!isAdmin) return sock.sendMessage(groupId, { text: '🖕 Admins only.' });
      await sock.groupParticipantsUpdate(groupId, [target], 'remove');
      await sock.sendMessage(groupId, { text: `🪂 Removed ${target}` });
      await react(sock, msg);
    }

    // groupicon
    else if (command === 'groupicon') {
      const img = groupMetadata?.pictureUrl;
      if (img) {
        await sock.sendMessage(groupId, { image: { url: img }, caption: '🤫 Group Icon' });
      } else {
        await sock.sendMessage(groupId, { text: '⚠️ No group icon found.' });
      }
      await react(sock, msg);
    }

    // shukranikillgroup
    else if (command === 'shukranikillgroup' && isOwner) {
      const nonOwner = groupMetadata.participants
        .filter(p => p.id !== senderId)
        .map(p => p.id);

      for (const m of nonOwner) {
        await sock.groupParticipantsUpdate(groupId, [m], 'remove');
      }

      await sock.groupRevokeInvite(groupId);
      const code = await sock.groupInviteCode(groupId);
      await sock.sendMessage(groupId, {
        text: `☠️ All members removed.\n🔗 New link:\nhttps://chat.whatsapp.com/${code}`
      });
      await react(sock, msg);
    }

    else {
      await sock.sendMessage(groupId, {
        text: `🔥 Group Commands:\n.group promoteall\n.group link\n.group welcome on/off\n.group goodbye on/off\n.group kick @tag\n.group remove @tag\n.group groupicon\n.group shukranikillgroup`
      });
    }
  },

  onMessage: async (sock, msg) => {
    const groupId = msg.key.remoteJid;
    const config = loadConfig();

    if (msg.messageStubType === 27 && config.welcome[groupId]) {
      const user = msg.messageStubParameters[0];
      await sock.sendMessage(groupId, { text: `👋 Welcome @${user.split('@')[0]}!`, mentions: [user] });
    }

    if (msg.messageStubType === 32 && config.goodbye[groupId]) {
      const user = msg.messageStubParameters[0];
      await sock.sendMessage(groupId, { text: `👋 Goodbye @${user.split('@')[0]}!`, mentions: [user] });
    }
  }
};
