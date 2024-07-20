const referralLeaderboardHandler = require('../referralLeaderboardHandler');

async function handleReferralLeaderboard(bot, msg) {
    const chatId = msg.chat.id;
    const leaderboard = await referralLeaderboardHandler.getReferralLeaderboard(chatId);

    if (leaderboard.length === 0) {
        bot.sendMessage(chatId, 'No referrals yet.');
    } else {
        let leaderboardMessage = 'Referral Leaderboard:\n\n';
        leaderboard.forEach((entry, index) => {
            leaderboardMessage += `${index + 1}. ${entry.username} - Invites: ${entry.count}\n`;
        });
        bot.sendMessage(chatId, leaderboardMessage);
    }
}

module.exports = { handleReferralLeaderboard };