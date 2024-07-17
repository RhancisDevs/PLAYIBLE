const fs = require('fs');

const referralsFile = './data/referrals.json';

let referrals = {};

// Load referrals from file
if (fs.existsSync(referralsFile)) {
    try {
        const data = fs.readFileSync(referralsFile, 'utf-8');
        referrals = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing referrals.json:', error);
        referrals = {};
    }
}

function saveReferrals() {
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));
}

function addReferral(userId, chatId) {
    if (!referrals[chatId]) {
        referrals[chatId] = {};
    }

    if (!referrals[chatId][userId]) {
        referrals[chatId][userId] = 0;
    }

    referrals[chatId][userId]++;
    saveReferrals();
}

function getReferralCount(userId, chatId) {
    if (referrals[chatId] && referrals[chatId][userId]) {
        return referrals[chatId][userId];
    }
    return 0;
}

function getReferralLeaderboard() {
    const leaderboard = [];
    Object.entries(referrals).forEach(([chatId, userReferrals]) => {
        Object.entries(userReferrals).forEach(([userId, count]) => {
            leaderboard.push({ userId, count });
        });
    });

    leaderboard.sort((a, b) => b.count - a.count); // Sort by count descending

    return leaderboard;
}

module.exports = {
    addReferral,
    getReferralCount,
    getReferralLeaderboard
};