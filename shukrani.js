// SHUKRANI BOT Main File
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const P = require('pino')
const path = require('path')

// Import command handler
const handleCommand = require('./shukranicmd') // Command folder

// Path to store session
const SESSION_FILE = './session/shukrani_session.json'

// Ensure session folder exists
if (!fs.existsSync('./session')) fs.mkdirSync('./session')

// Load session
const { state, saveState } = useSingleFileAuthState(SESSION_FILE)

// Function to start the bot
async function startBot() {
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
    })

    // Save session whenever it's updated
    sock.ev.on('creds.update', saveState)

    // Handle connection updates
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

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return // Prevent replying to itself

        const sender = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (!text) return

        console.log(`📩 ${sender}: ${text}`)

        // Pass message to command handler
        await handleCommand(sock, sender, text)
    })
}

// Start the bot
startBot()
