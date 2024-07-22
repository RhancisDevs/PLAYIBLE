const { handleNewPlayerQuestion, handleNewPlayerAnswer } = require('./commands/qa2'); // Adjust path if necessary

const commands = [
    { command: '/geninvitelink', description: 'Generate an invite link' },
    { command: '/topinvite', description: 'Show referral leaderboard' },
    { command: '/toppoints', description: 'Show points leaderboard' },
    { command: '/question', description: 'Ask a question for users to answer to gain points' },
    { command: '/help', description: 'Show available commands' },
    { command: '/mechanics', description: 'Explain bot mechanics and prizes' },
    { command: '/newplayerquestions', description: 'Answer questions for new players' }
];

bot.setMyCommands(commands);

bot.onText(/\/geninvitelink/, (msg) => handleInvites(bot, msg));
bot.onText(/\/topinvite/, (msg) => handleReferralLeaderboard(bot, msg));
bot.onText(/\/toppoints/, (msg) => handlePointsLeaderboard(bot, msg));
bot.onText(/\/question/, (msg) => handleQuestion(bot, msg));
bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
bot.onText(/\/mechanics/, (msg) => handleMechanics(bot, msg));
bot.onText(/\/newplayerquestions/, (msg) => handleNewPlayerQuestion(bot, msg));

bot.on('message', (msg) => {
    handleNewPlayerAnswer(bot, msg);
});

bot.on('chat_join_request', async (msg) => {
    const newMemberName = msg.from.username || msg.from.first_name;
    const inviteLink = msg.invite_link;
    const chatId = msg.chat.id;

    if (inviteLink && referralLeaderboardHandler.getInviteLinkData(inviteLink.invite_link)) {
        const inviter = referralLeaderboardHandler.getInviteLinkData(inviteLink.invite_link);
        const inviterId = inviter.userId;

        try {
            await bot.approveChatJoinRequest(chatId, msg.from.id);
            const inviterUser = await bot.getChatMember(chatId, inviterId);
            const inviterName = inviterUser.user.username || inviterUser.user.first_name;
            const welcomeMessage = `${newMemberName} has joined the channel, invited by ${inviterName}`;
            bot.sendMessage(chatId, welcomeMessage);
            referralLeaderboardHandler.updateLeaderboard(inviterId, inviterName);
        } catch (error) {
            console.error('Error approving join request or sending welcome message:', error);
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