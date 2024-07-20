const TelegramBot = require('node-telegram-bot-api');
const { handleInvites } = require('./commands/invites');
const { handleReferralLeaderboard } = require('./commands/referralLeaderboard');
const { handlePointsLeaderboard } = require('./commands/pointsLeaderboard');
const { handleQuestion, handleAnswer } = require('./commands/qa');
const { handleMechanics } = require('./commands/mechanics');
const pointsHandler = require('./pointsHandler');
const referralLeaderboardHandler = require('./referralLeaderboardHandler');

const token = process.env.tk || 'YOUR_BOT_TOKEN_HERE'; // Replace with your bot token if not using environment variable
const bot = new TelegramBot(token, { polling: true });

const commands = [
    { command: '/geninvitelink', description: 'Generate an invite link' },
    { command: '/topinvite', description: 'Show referral leaderboard' },
    { command: '/toppoints', description: 'Show points leaderboard' },
    { command: '/question', description: 'Ask a question for users to answer to gain points' },
    { command: '/help', description: 'Show available commands' },
    { command: '/mechanics', description: 'Explain bot mechanics and prizes' }
];

bot.setMyCommands(commands);

bot.onText(/\/geninvitelink/, (msg) => handleInvites(bot, msg));
bot.onText(/\/topinvite/, (msg) => handleReferralLeaderboard(bot, msg));
bot.onText(/\/toppoints/, (msg) => handlePointsLeaderboard(bot, msg));
bot.onText(/\/question/, (msg) => handleQuestion(bot, msg));
bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
bot.onText(/\/mechanics/, (msg) => handleMechanics(bot, msg));

bot.on('message', async (msg) => {
    if (msg.reply_to_message) {
        handleAnswer(bot, msg);
    }
});

bot.on('chat_join_request', async (msg) => {
    const newMemberName = msg.from.username || msg.from.first_name;
    const inviteLink = msg.invite_link;
    const chatId = msg.chat.id;
    const newUserId = msg.from.id;

    if (inviteLink) {
        const inviterData = referralLeaderboardHandler.getInviteLinkData(chatId, inviteLink.invite_link);
        if (inviterData) {
            const inviterUsername = inviterData.userId;
            try {
                await bot.approveChatJoinRequest(chatId, newUserId);
                const inviterUser = await bot.getChatMember(chatId, newUserId);
                const inviterName = inviterUser.user.username || inviterUser.user.first_name;
                const welcomeMessage = `${newMemberName} has joined the channel, invited by ${inviterName}`;
                bot.sendMessage(chatId, welcomeMessage);
                referralLeaderboardHandler.updateLeaderboard(inviterUsername, chatId, newUserId);
            } catch (error) {
                console.error('Error approving join request or sending welcome message:', error);
            }
        }
    }
});

function handleHelp(bot, msg) {
    const chatId = msg.chat.id;
    let helpMessage = 'Available Commands:\n\n';
    commands.forEach(cmd => {
        helpMessage += `${cmd.command} - ${cmd.description}\n`;
    });
    bot.sendMessage(chatId, helpMessage);
}

bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log('Bot is running...');