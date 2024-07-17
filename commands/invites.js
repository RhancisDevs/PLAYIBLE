const { createInviteLink } = require('../inviteLinkHandler');

const facebookLink = 'https://www.facebook.com/Applpsgn';
const discordLink = 'https://discord.gg/example';

const additionalMessage = `
Make sure to follow our Facebook page: [Facebook](${facebookLink})
Join our Discord server: [Discord](${discordLink})
`;

async function handleInvites(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.username || msg.from.first_name;

    try {
        const inviteLink = await createInviteLink(chatId, userId);
        bot.sendMessage(chatId, `🌟 ${userName}, here is your invite link: ${inviteLink} 🌟\n${additionalMessage}`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, '⚠️ Sorry, an error occurred while generating the invite link.');
        console.error(error);
    }
}

module.exports = { handleInvites };