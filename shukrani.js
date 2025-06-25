// SHUKRANI BOT - index.js (command handler)
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'configStore.json');

// Load config or initialize
let config = {};
if (fs.existsSync(configPath)) config = JSON.parse(fs.readFileSync(configPath));
const saveConfig = () => fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Load all command modules from the current folder
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');
const commands = [];

for (const file of commandFiles) {
  const command = require(path.join(__dirname, file));
  if (command.name && typeof command.execute === 'function') {
    commands.push(command);
  }
}

console.log('✅ Loaded Commands:');
commands.forEach(cmd => console.log('—', cmd.name));

// Export main handler
module.exports = async (sock, sender, text, msg) => {
  const rawText = text.trim();
  const groupId = msg.key.remoteJid;

  // Handle prefix switch
  if (rawText.toLowerCase().startsWith('prifex')) {
    const value = rawText.split(' ')[1];
    if (value === 'yes') {
      config.prefix = true;
      saveConfig();
      await sock.sendMessage(groupId, { text: '✅ Prefix mode is ON (commands require prefix).' });
    } else if (value === 'no') {
      config.prefix = false;
      saveConfig();
      await sock.sendMessage(groupId, { text: '❌ Prefix mode is OFF (commands do not require prefix).' });
    } else {
      await sock.sendMessage(groupId, { text: 'Usage: prifex yes | prifex no' });
    }
    return;
  }

  // Handle menu command
  if (rawText.toLowerCase() === 'menu') {
    const grouped = {
      GROUP: [],
      SYSTEM: [],
      OTHER: [],
      DOWNLOAD: [],
    };

    for (const cmd of commands) {
      const lower = cmd.name.toLowerCase();
      if (['tagall', 'kick', 'link', 'promoteall', 'shukranikillgroup'].includes(lower)) {
        grouped.GROUP.push(lower);
      } else if (['alwaysonline', 'mode', 'autoread', 'setbotname', 'settimezone'].some(k => lower.includes(k))) {
        grouped.SYSTEM.push(lower);
      } else if (['ping', 'pair', 'runtime', 'repo', 'botstatus'].includes(lower)) {
        grouped.OTHER.push(lower);
      } else if (['ytmp3', 'ytmp4', 'tiktok', 'mediafire', 'apk', 'play'].some(k => lower.includes(k))) {
        grouped.DOWNLOAD.push(lower);
      }
    }

    const format = (title, arr) => arr.length ? `📂 *${title}*\n${arr.sort().map(c => `- ${c}`).join('\n')}\n` : '';
    const output = [
      format('GROUP', grouped.GROUP),
      format('SYSTEM', grouped.SYSTEM),
      format('OTHER', grouped.OTHER),
      format('DOWNLOAD', grouped.DOWNLOAD),
    ].filter(Boolean).join('\n');

    await sock.sendMessage(groupId, { react: { text: '🙋', key: msg.key } });
    await sock.sendMessage(groupId, {
      text: `🎯 *SHUKRANI BOT MENU*\n\n${output || 'No commands found.'}`
    });
    return;
  }

  // Run any onMessage hooks (like antilink, autoreact, etc.)
  for (const cmd of commands) {
    if (typeof cmd.onMessage === 'function') {
      try {
        await cmd.onMessage(sock, msg);
      } catch (e) {
        console.error(`❌ Error in onMessage for ${cmd.name}:`, e);
      }
    }
  }

  // Compare against command names
  const compareText = rawText.toLowerCase();
  for (const cmd of commands) {
    const match = config.prefix
      ? compareText.startsWith(cmd.name) || compareText.startsWith('.' + cmd.name) || compareText.startsWith('/' + cmd.name)
      : compareText.startsWith(cmd.name);

    if (match) {
      try {
        await cmd.execute(sock, msg, text);
      } catch (e) {
        console.error(`❌ Error in command ${cmd.name}:`, e);
      }
    }
  }
};
