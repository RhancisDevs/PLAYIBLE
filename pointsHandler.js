const fs = require('fs');
const path = require('path');

const pointsFilePath = path.join(__dirname, 'data', 'points.json');

function getPoints() {
    try {
        const data = fs.readFileSync(pointsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading points.json:', error);
        return {};
    }
}

function updatePoints(chatId, userId, userName, incrementBy) {
    try {
        const points = getPoints();

        if (!points[chatId]) {
            points[chatId] = {};
        }

        if (!points[chatId][userId]) {
            points[chatId][userId] = {
                userName: userName,
                points: 0
            };
        }

        points[chatId][userId].points += incrementBy;

        fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2));
    } catch (error) {
        console.error('Error updating points.json:', error);
    }
}

function getPointsLeaderboard(chatId) {
    try {
        const points = getPoints();

        if (!points[chatId]) {
            return [];
        }

        // Convert points object to an array and sort it by points in descending order
        const leaderboard = Object.keys(points[chatId])
            .map(userId => ({
                userId,
                userName: points[chatId][userId].userName,
                points: points[chatId][userId].points
            }))
            .sort((a, b) => b.points - a.points);

        return leaderboard;
    } catch (error) {
        console.error('Error reading points.json:', error);
        return [];
    }
}

module.exports = {
    getPoints,
    updatePoints,
    getPointsLeaderboard,
};