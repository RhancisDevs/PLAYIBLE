const fs = require('fs');
const path = require('path');
const referralLeaderboardHandler = require('../referralLeaderboardHandler');

const questionsFile = path.join(__dirname, '../data/question2.json');
let questions = [];

if (fs.existsSync(questionsFile)) {
    try {
        const data = fs.readFileSync(questionsFile, 'utf-8');
        questions = data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error parsing question2.json:', error);
        questions = [];
    }
}

let playerProgress = {};

function savePlayerProgress() {
    fs.writeFileSync('./data/playerProgress.json', JSON.stringify(playerProgress, null, 2));
}

if (fs.existsSync('./data/playerProgress.json')) {
    try {
        const data = fs.readFileSync('./data/playerProgress.json', 'utf-8');
        playerProgress = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing playerProgress.json:', error);
        playerProgress = {};
    }
}

function handleNewPlayerQuestion(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!playerProgress[userId]) {
        playerProgress[userId] = { currentQuestionIndex: 0, correctAnswers: 0, inviterId: null };
    }

    const inviteLinkData = referralLeaderboardHandler.getInviteLinkData(chatId, msg.invite_link);
    if (inviteLinkData) {
        playerProgress[userId].inviterId = inviteLinkData.userId;
    }

    askQuestion(bot, chatId, userId);
}

function askQuestion(bot, chatId, userId) {
    const userProgress = playerProgress[userId];

    if (userProgress.currentQuestionIndex < questions.length) {
        const currentQuestion = questions[userProgress.currentQuestionIndex];
        const questionText = `${currentQuestion.question}\n${currentQuestion.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n')}`;
        bot.sendMessage(chatId, questionText);
    } else {
        if (userProgress.correctAnswers === questions.length) {
            const inviterId = userProgress.inviterId;
            if (inviterId) {
                referralLeaderboardHandler.addReferral(inviterId, chatId);
                bot.sendMessage(chatId, `All questions answered correctly! Your inviter has earned a referral point.`);
            }
        } else {
            bot.sendMessage(chatId, `You did not answer all questions correctly. Try again later.`);
        }

        // Reset progress for the user
        delete playerProgress[userId];
        savePlayerProgress();
    }
}

function handleNewPlayerAnswer(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userProgress = playerProgress[userId];
    const answer = msg.text.trim();

    if (userProgress) {
        const currentQuestion = questions[userProgress.currentQuestionIndex];

        if (currentQuestion.choices.includes(answer)) {
            if (answer === currentQuestion.correct_answer) {
                userProgress.correctAnswers++;
                bot.sendMessage(chatId, `Correct!`);
            } else {
                bot.sendMessage(chatId, `Incorrect. The correct answer was ${currentQuestion.correct_answer}.`);
            }

            userProgress.currentQuestionIndex++;
            savePlayerProgress();
            askQuestion(bot, chatId, userId);
        } else {
            bot.sendMessage(chatId, 'Please choose a valid option.');
        }
    }
}

module.exports = { handleNewPlayerQuestion, handleNewPlayerAnswer };