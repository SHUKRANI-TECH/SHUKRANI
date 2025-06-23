// SHUKRANI BOT Main File with QR + Pairing Code support

const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const P = require('pino')
const path = require('path')

// Import command handler (from shukranicmd/index.js)
const handleCommand = require('./shukranicmd')

// Session storage
const SESSION_FILE = './session/shukrani_session.json'
if (!fs.existsSync('./session')) fs.mkdirSync('./session')
const { state, saveState } = useSingleFileAuthState(SESSION_FILE)

// Start bot
async function startBot() {
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('creds.update', saveState)

    // Pairing code (for first-time login)
    if (!state.creds.registered) {
        try {
            const phoneNumber = '2557XXXXXXX' // replace with your number (no +)
            const code = await sock.requestPairingCode(phoneNumber)
            console.log(`🔑 Pairing code: ${code}\nOpen WhatsApp > Linked Devices`)
        } catch (err) {
            console.log('⚠️ Pairing failed. Scan QR instead...')
        }
    }

    // Connection status
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('[!] Disconnected.', shouldReconnect ? 'Reconnecting...' : 'Logged out.')
            if (shouldReconnect) setTimeout(startBot, 5000)
        } else if (connection === 'open') {
            console.log('✅ SHUKRANI BOT is connected!')
        }
    })

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const sender = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return

        console.log(`📩 ${sender}: ${text}`)
        await handleCommand(sock, sender, text, msg)
    })
}

// Start bot
startBot()
