const fs = require('fs');
const path = require('path');
const axios = require('axios');

const referralsFile = path.join(__dirname, './data/referrals.json');
const inviteLinksFile = path.join(__dirname, './data/inviteLinks.json');

let referrals = {};
let inviteLinks = {};

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

// Load invite links from file
if (fs.existsSync(inviteLinksFile)) {
    try {
        const data = fs.readFileSync(inviteLinksFile, 'utf-8');
        inviteLinks = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing inviteLinks.json:', error);
        inviteLinks = {};
    }
}

function saveReferrals() {
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));
}

function saveInviteLinks() {
    fs.writeFileSync(inviteLinksFile, JSON.stringify(inviteLinks, null, 2));
}

async function getUsername(chatId, userId) {
    const url = `https://api.telegram.org/bot${process.env.tk}/getChatMember`;
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            user_id: userId
        });
        return response.data.result.user.username || response.data.result.user.first_name;
    } catch (error) {
        console.error(`Error fetching username for userId ${userId}:`, error);
        return `User ${userId}`;
    }
}

async function addReferral(inviterUserId, chatId, newUserId) {
    const inviterUsername = await getUsername(chatId, inviterUserId);

    if (!referrals[chatId]) {
        referrals[chatId] = {};
    }

    if (!referrals[chatId][inviterUsername]) {
        referrals[chatId][inviterUsername] = { count: 0, users: [] };
    }

    referrals[chatId][inviterUsername].count++;
    referrals[chatId][inviterUsername].users.push(newUserId);
    saveReferrals();
}

function getInviteLinkData(chatId, inviteLink) {
    return inviteLinks[chatId] ? inviteLinks[chatId][inviteLink] : null;
}

function getReferralCount(username, chatId) {
    if (referrals[chatId] && referrals[chatId][username]) {
        return referrals[chatId][username].count;
    }
    return 0;
}

function getReferralLeaderboard(chatId) {
    if (!referrals[chatId]) {
        return [];
    }

    const leaderboard = Object.entries(referrals[chatId])
        .map(([username, data]) => ({ username, count: data.count }))
        .sort((a, b) => b.count - a.count); // Sort by count descending

    return leaderboard;
}

async function updateLeaderboard(inviterUserId, chatId, newUserId) {
    await addReferral(inviterUserId, chatId, newUserId);
}

module.exports = {
    addReferral,
    getReferralCount,
    getReferralLeaderboard,
    getInviteLinkData,
    updateLeaderboard
};