// SHUKRANI BOT Main File with QR + Pairing Code support

const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const P = require('pino')
const path = require('path')

// Import command handler
const handleCommand = require('./shukranicmd')

// Path to store session
const SESSION_FILE = './session/shukrani_session.json'

// Ensure session folder exists
if (!fs.existsSync('./session')) fs.mkdirSync('./session')

// Load session
const { state, saveState } = useSingleFileAuthState(SESSION_FILE)

// Function to start bot
async function startBot() {
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true, // QR support
        auth: state
    })

    // Save session on every update
    sock.ev.on('creds.update', saveState)

    // Try pairing code (only if not already registered)
    if (!state.creds.registered) {
        try {
            const phoneNumber = '2557XXXXXXX' // << REPLACE this with your number without "+"
            const code = await sock.requestPairingCode(phoneNumber)
            console.log(`🔑 Pairing code: ${code}\nEnter this in your WhatsApp > Linked Devices`)
        } catch (err) {
            console.log('⚠️ Pairing code failed. Falling back to QR scan...')
        }
    }

    // Connection handler
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('[!] Connection closed.', shouldReconnect ? 'Reconnecting...' : 'Logged out.')
            if (shouldReconnect) {
                setTimeout(startBot, 5000)
            }
        } else if (connection === 'open') {
            console.log('✅ SHUKRANI BOT is connected and ready.')
        }
    })

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const sender = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (!text) return

        console.log(`📩 ${sender}: ${text}`)
        await handleCommand(sock, sender, text)
    })
}

// Start bot
startBot()
