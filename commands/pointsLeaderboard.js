const TelegramBot = require('node-telegram-bot-api');
const pointsHandler = require('../pointsHandler');

function handlePointsLeaderboard(bot, msg) {
    const chatId = msg.chat.id;
    const leaderboard = pointsHandler.getPointsLeaderboard(chatId);

    let leaderboardMessage = '🏆 Points Leaderboard 🏆\n\n';
    leaderboard.forEach((entry, index) => {
        leaderboardMessage += `${index + 1}. ${entry.userName}: ${entry.points} points\n`;
    });

    bot.sendMessage(chatId, leaderboardMessage);
}

module.exports = { handlePointsLeaderboard };