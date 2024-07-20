const { createInviteLink } = require('../inviteLinkHandler');
const fs = require('fs');
const path = require('path');
const pointsHandler = require('../pointsHandler');

const invitesFile = path.join(__dirname, '../data/invites.json');
let invites = {};

// Load invites from file
if (fs.existsSync(invitesFile)) {
    try {
        const data = fs.readFileSync(invitesFile, 'utf-8');
        invites = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing invites.json:', error);
        invites = {};
    }
}

function saveInvites() {
    fs.writeFileSync(invitesFile, JSON.stringify(invites, null, 2));
}

async function handleInvites(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.username || msg.from.first_name;

    // Check if the user has already generated an invite link
    if (invites[userId]) {
        bot.sendMessage(chatId, `🌟 ${userName}, you have already generated an invite link: ${invites[userId]} 🌟`);
        return;
    }

    try {
        const inviteLink = await createInviteLink(chatId, userId);
        invites[userId] = inviteLink;
        saveInvites();

        const additionalMessage = `
        Make sure to follow our Facebook page: [Facebook](https://www.facebook.com/Applpsgn)
        Join our Discord server: [Discord](https://discord.gg/example)
        `;

        bot.sendMessage(chatId, `🌟 ${userName}, here is your invite link: ${inviteLink} 🌟\n${additionalMessage}`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, '⚠️ Sorry, an error occurred while generating the invite link.');
        console.error('Error generating invite link:', error);
    }
}

module.exports = { handleInvites };