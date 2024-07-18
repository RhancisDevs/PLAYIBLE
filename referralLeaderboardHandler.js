const fs = require('fs');
const path = require('path');

const referralsFile = path.join(__dirname, './data/referrals.json');
const invitesFile = path.join(__dirname, './data/invites.json');

let referrals = {};
let invites = {};

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

function saveReferrals() {
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));
}

function saveInvites() {
    fs.writeFileSync(invitesFile, JSON.stringify(invites, null, 2));
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

function getInviteLinkData(inviteLink) {
    return invites[inviteLink];
}

function addInviteLink(userId, inviteLink) {
    invites[inviteLink] = userId;
    saveInvites();
}

function deleteInviteLink(inviteLink) {
    delete invites[inviteLink];
    saveInvites();
}

module.exports = {
    addReferral,
    getReferralCount,
    getReferralLeaderboard,
    getInviteLinkData,
    addInviteLink,
    deleteInviteLink
};