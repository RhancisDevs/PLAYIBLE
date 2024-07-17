const fs = require('fs');
const path = require('path');
const pointsHandler = require('../pointsHandler');

const qaAnswersFile = path.join(__dirname, '../data/qaAnswers.json');
const questionsFile = path.join(__dirname, '../data/questions.json');

let qaAnswers = {};
let questions = [];

// Load QA answers from file
if (fs.existsSync(qaAnswersFile)) {
    try {
        const data = fs.readFileSync(qaAnswersFile, 'utf-8');
        qaAnswers = data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error parsing qaAnswers.json:', error);
        qaAnswers = {};
    }
}

// Load questions from file
if (fs.existsSync(questionsFile)) {
    try {
        const data = fs.readFileSync(questionsFile, 'utf-8');
        questions = data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error parsing questions.json:', error);
        questions = [];
    }
}

function saveQaAnswers() {
    fs.writeFileSync(qaAnswersFile, JSON.stringify(qaAnswers, null, 2));
}

function getQuestionById(questionId) {
    return questions.find(q => q.id === questionId);
}

function handleQuestion(bot, msg) {
    const chatId = msg.chat.id;
    if (questions.length === 0) {
        bot.sendMessage(chatId, 'No questions available.');
        return;
    }

    const unansweredQuestion = questions.find(q => !qaAnswers[q.id] || !qaAnswers[q.id].hasWinner);
    if (!unansweredQuestion) {
        bot.sendMessage(chatId, 'No active question found.');
        return;
    }

    qaAnswers[unansweredQuestion.id] = {
        correctAnswer: unansweredQuestion.correctAnswer,
        answered: {},
        hasWinner: false
    };
    saveQaAnswers();

    const options = {
        reply_markup: {
            force_reply: true
        }
    };

    bot.sendMessage(chatId, unansweredQuestion.question, options)
        .then(sentMessage => {
            qaAnswers[unansweredQuestion.id].messageId = sentMessage.message_id;
            saveQaAnswers();
        });
}

async function handleAnswer(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.username || msg.from.first_name;

    const questionId = Object.keys(qaAnswers).find(id => qaAnswers[id].messageId === msg.reply_to_message.message_id);
    if (!questionId) {
        return; // If the message is not a reply to a question, ignore it
    }

    const userAnswer = msg.text.trim();

    if (qaAnswers[questionId].hasWinner) {
        bot.sendMessage(chatId, 'This question already has a correct answer. Please wait for a new question from the admin.');
        return;
    }

    if (qaAnswers[questionId].answered[userId]) {
        bot.sendMessage(chatId, 'You have already answered this question.');
        return;
    }

    qaAnswers[questionId].answered[userId] = true;
    saveQaAnswers();

    if (userAnswer === qaAnswers[questionId].correctAnswer) {
        qaAnswers[questionId].hasWinner = true;
        saveQaAnswers();

        // Increment points for correct answer
        pointsHandler.updatePoints(chatId, userId, userName, 1);

        bot.sendMessage(chatId, `🎉 ${userName} has answered correctly and earned 1 point! 🎉`);
    } else {
        bot.sendMessage(chatId, 'Wrong answer!');
    }
}

module.exports = { handleQuestion, handleAnswer };