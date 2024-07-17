const { getLeaderboardMessage } = require('../leaderboardHandler');

const facebookLink = 'https://www.facebook.com/Applpsgn';
const discordLink = 'https://discord.gg/example';

const additionalMessage = `
Make sure to follow our Facebook page: [Facebook](${facebookLink})
Join our Discord server: [Discord](${discordLink})
`;

function handleLeaderboard(bot, msg) {
    const chatId = msg.chat.id;
    const leaderboardMessage = getLeaderboardMessage(chatId);
    bot.sendMessage(chatId, `🏆 Referral Leaderboard 🏆\n${leaderboardMessage}\n${additionalMessage}`, { parse_mode: 'Markdown' });
}

module.exports = { handleLeaderboard };