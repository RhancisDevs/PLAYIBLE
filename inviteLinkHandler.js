const axios = require('axios');
const fs = require('fs');

const token = process.env.tk || 'YOUR_BOT_TOKEN_HERE'; // Replace with your bot token if not using environment variable
const inviteLinksFile = './data/inviteLinks.json';

let inviteLinks = {};

if (fs.existsSync(inviteLinksFile)) {
    try {
        const data = fs.readFileSync(inviteLinksFile, 'utf-8');
        inviteLinks = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing inviteLinks.json:', error);
        inviteLinks = {};
    }
}

function saveInviteLinks() {
    fs.writeFileSync(inviteLinksFile, JSON.stringify(inviteLinks, null, 2));
}

async function createInviteLink(chatId, userId) {
    const url = `https://api.telegram.org/bot${token}/createChatInviteLink`;
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            creates_join_request: true
        });
        const inviteLink = response.data.result.invite_link;
        if (!inviteLinks[chatId]) {
            inviteLinks[chatId] = {};
        }
        inviteLinks[chatId][inviteLink] = { userId: userId.toString() };
        saveInviteLinks();
        return inviteLink;
    } catch (error) {
        console.error('Error creating invite link:', error);
        throw error;
    }
}

function getInviteLinkData(chatId, inviteLink) {
    return inviteLinks[chatId] ? inviteLinks[chatId][inviteLink] : null;
}

module.exports = { createInviteLink, getInviteLinkData };