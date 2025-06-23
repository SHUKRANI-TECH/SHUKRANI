const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, makeInMemoryStore } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const figlet = require('figlet');
const chalk = require('chalk');
const path = require('path');
const handleCommand = require('./index');

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
store.readFromFile('./baileys_store.json');
setInterval(() => store.writeToFile('./baileys_store.json'), 10_000);

console.clear();
console.log(chalk.cyan(figlet.textSync('SHUKRANI BOT', { horizontalLayout: 'default' })));

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['Shukrani Bot', 'Chrome', '1.0.0']
  });

  store.bind(sock.ev);
  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red(`❌ Connection closed due to ${lastDisconnect.error}. Reconnecting: ${shouldReconnect}`));
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log(chalk.green('✅ SHUKRANI BOT is now connected!'));
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    await handleCommand(sock, msg);
  });
}

startBot();
