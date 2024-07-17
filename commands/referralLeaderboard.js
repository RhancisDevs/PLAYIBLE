const TelegramBot = require('node-telegram-bot-api');
const referralLeaderboardHandler = require('../referralLeaderboardHandler'); // Adjust the path as per your directory structure

function handleReferralLeaderboard(bot, msg) {
    const chatId = msg.chat.id;
    const leaderboard = referralLeaderboardHandler.getReferralLeaderboard();

    let leaderboardMessage = '🌟 Referral Leaderboard 🌟\n\n';
    leaderboard.forEach((entry, index) => {
        // Replace with your method to fetch username based on userId
        const userName = getUsername(entry.userId); // Replace with your method to get username
        leaderboardMessage += `${index + 1}. ${userName}: ${entry.count} invites\n`;
    });

    // Example message with additional links
    leaderboardMessage += '\n\nMake sure to follow our Facebook page and join our Discord server:\n';
    leaderboardMessage += 'Facebook: [https://www.facebook.com/Applpsgn](https://www.facebook.com/Applpsgn)\n';
    leaderboardMessage += 'Discord: [example.discord.com](https://example.discord.com)\n';

    bot.sendMessage(chatId, leaderboardMessage, { parse_mode: 'Markdown' });
}

module.exports = { handleReferralLeaderboard };