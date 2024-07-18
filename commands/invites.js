const fs = require('fs');
const path = require('path');
const { createInviteLink } = require('../inviteLinkHandler');

const facebookLink = 'https://www.facebook.com/Applpsgn';
const discordLink = 'https://discord.gg/example';

const invitesFilePath = path.join(__dirname, '../data/invites.json');

const additionalMessage = `
Make sure to follow our Facebook page: [Facebook](${facebookLink})
Join our Discord server: [Discord](${discordLink})
`;

// Load existing invites from file
let invites = {};
if (fs.existsSync(invitesFilePath)) {
    try {
        const data = fs.readFileSync(invitesFilePath, 'utf-8');
        invites = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing invites.json:', error);
        invites = {};
    }
}

function saveInvites() {
    fs.writeFileSync(invitesFilePath, JSON.stringify(invites, null, 2));
}

async function handleInvites(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.username || msg.from.first_name;

    if (invites[userId]) {
        bot.sendMessage(chatId, `⚠️ ${userName}, you have already generated an invite link: ${invites[userId]}\n${additionalMessage}`, { parse_mode: 'Markdown' });
        return;
    }

    try {
        const inviteLink = await createInviteLink(chatId, userId);
        invites[userId] = inviteLink;
        saveInvites();

        bot.sendMessage(chatId, `🌟 ${userName}, here is your invite link: ${inviteLink} 🌟\n${additionalMessage}`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, '⚠️ Sorry, an error occurred while generating the invite link.');
        console.error(error);
    }
}

module.exports = { handleInvites };