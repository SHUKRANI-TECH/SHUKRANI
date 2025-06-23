const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');
const pino = require('pino');
const qrcode = require('qrcode');
const { Boom } = require('@hapi/boom');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    version,
    browser: ['SHUKRANI-BOT', 'Chrome', '1.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;

    if (qr) {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) return console.error('QR Error:', err);
        console.log('🔗 QR Code URL (scan via browser or view image):', url);
      });
    }

    if (pairingCode) {
      console.log('🔗 Pairing Code Link:', `https://wa.me/pair/${pairingCode}`);
    }

    if (connection === 'open') {
      console.log('✅ SHUKRANI BOT connected!');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Closed:', lastDisconnect.error, 'Reconnect?', shouldReconnect);
      if (shouldReconnect) await startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text;
    console.log('📥', from, body);
    await sock.sendMessage(from, { text: `Umesema: ${body}` });
  });
}

startBot().catch(console.error);
