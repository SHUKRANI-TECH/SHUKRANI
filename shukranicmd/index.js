const fs = require('fs');
const path = require('path');

// Load all command modules from the current folder
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');
const commands = [];

for (const file of commandFiles) {
    const command = require(path.join(__dirname, file));
    if (command.name && typeof command.execute === 'function') {
        commands.push(command);
    }
}

// Export main handler
module.exports = async (sock, sender, text, msg) => {
    // Run any onMessage hooks (e.g., background checks like antilink)
    for (const cmd of commands) {
        if (typeof cmd.onMessage === 'function') {
            try {
                await cmd.onMessage(sock, msg);
            } catch (e) {
                console.error(`❌ Error in onMessage for ${cmd.name}:`, e);
            }
        }
    }

    // Command execution logic (only if message is from user and matches a command)
    for (const cmd of commands) {
        if (text.toLowerCase().startsWith(cmd.name)) {
            try {
                await cmd.execute(sock, msg, text);
            } catch (e) {
                console.error(`❌ Error in command ${cmd.name}:`, e);
            }
        }
    }
};
