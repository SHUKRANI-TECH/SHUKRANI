// NOTE: Due to the length, here is a cleaned-up and functional version of the code // with proper structuring, modularity, and error fixing.

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, getContentType, jidDecode, makeInMemoryStore } = require('@whiskeysockets/baileys'); const pino = require('pino'); const fs = require('fs-extra'); const path = require('path'); const conf = require('./set');

async function authentification() { try { const credsPath = path.join(__dirname, 'auth', 'creds.json'); const session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g, ''); if (!fs.existsSync(credsPath) || session !== 'zokk') { await fs.outputFile(credsPath, atob(session), 'utf8'); console.log('Session file created/updated.'); } } catch (e) { console.error('Session Invalid:', e); } }

function atob(str) { return Buffer.from(str, 'base64').toString('binary'); }

authentification();

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });

setTimeout(() => { main(); }, 500);

async function main() { const { version } = await fetchLatestBaileysVersion(); const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));

const sock = makeWASocket({ version, logger: pino({ level: 'silent' }), printQRInTerminal: true, browser: ['SHUKRANI', 'Safari', '1.0.0'], auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) }, getMessage: async (key) => { const msg = await store.loadMessage(key.remoteJid, key.id); return msg?.message || { conversation: 'Message not found' }; } });

store.bind(sock.ev);

sock.ev.on('messages.upsert', async ({ messages }) => { const msg = messages[0]; if (!msg.message) return;

const mtype = getContentType(msg.message);
const text = mtype === 'conversation' ? msg.message.conversation :
  mtype === 'extendedTextMessage' ? msg.message.extendedTextMessage.text : '';

console.log("Received:", text);

// Example command detection
if (text?.toLowerCase() === 'ping') {
  await sock.sendMessage(msg.key.remoteJid, { text: 'Pong!' }, { quoted: msg });
}

// You can continue to expand this with your command handler structure

});

sock.ev.on('creds.update', saveCreds); console.log('✅ SHUKRANI Bot is running. Scan the QR if needed.');

    
