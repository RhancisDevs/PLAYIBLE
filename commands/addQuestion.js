    const fs = require('fs');
    const path = require('path');

    const questionsFile = path.join(__dirname, '../data/questions.json');

    function loadQuestions() {
        if (fs.existsSync(questionsFile)) {
            try {
                const data = fs.readFileSync(questionsFile, 'utf-8');
                return data ? JSON.parse(data) : [];
            } catch (error) {
                console.error('Error parsing questions.json:', error);
                return [];
            }
        }
        return [];
    }

    function saveQuestions(questions) {
        fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
    }

    function handleAddQuestion(bot, msg, match) {
        const chatId = msg.chat.id;
        const userInput = match[1];
        const [question, answer] = userInput.split('|').map(s => s.trim());

        if (!question || !answer) {
            bot.sendMessage(chatId, 'Please provide a valid question and answer separated by "|".');
            return;
        }

        const questions = loadQuestions();

        // Generate a new ID for the question
        const newQuestionId = questions.length ? (parseInt(questions[questions.length - 1].id) + 1).toString() : '1';

        const newQuestion = {
            id: newQuestionId,
            question: question,
            correctAnswer: answer
        };

        questions.push(newQuestion);
        saveQuestions(questions);

        bot.sendMessage(chatId, `New question added successfully!\n\nQuestion: ${question}\nAnswer: ${answer}`);
    }

    module.exports = { handleAddQuestion };