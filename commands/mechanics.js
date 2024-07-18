function handleMechanics(bot, msg) {
    const chatId = msg.chat.id;
    const mechanicsMessage = `
🤖 **Bot Mechanics and How to Participate** 🤖

1. **Generate an Invite Link**:
   - Use the /geninvitelink command to generate your unique invite link.
   - Share this link with your friends to invite them to the channel.
   - Note: You can only generate one invite link. If you need to delete it, use /geninvitelink del.
   - The top 6 referrers will receive a share of the 10k prize pool:
     - 🏆 Champ - [amount]
     - 🥇 1st - [amount]
     - 🥈 2nd - [amount]
     - 🥉 3rd - [amount]
     - 4th - [amount]
     - 5th - [amount]

2. **Referral Leaderboard**:
   - Check your referral status and leaderboard position using /topinvite.
   - The more friends you invite, the higher you climb on the leaderboard.

3. **Points Leaderboard**:
   - Participate in Q&A sessions to earn points.
   - Check your points status and leaderboard position using /toppoints.

4. **Q&A**:
   - Use the /question command to start a Q&A session.
   - Answer questions correctly to earn points. You need to reply to the bot's question message with the correct answer.
   - The first user to answer correctly earns a point.
   - The top 6 participants with the most points will also receive a share of the 10k prize pool:
     - 🏆 Champ - [amount]
     - 🥇 1st - [amount]
     - 🥈 2nd - [amount]
     - 🥉 3rd - [amount]
     - 4th - [amount]
     - 5th - [amount]

5. **Prize Pool**:
   - The top 6 referrers and Q&A participants will receive a share of the 10k prize pool as mentioned above.

Follow our Facebook page: [Facebook](https://www.facebook.com/Applpsgn)
Join our Discord server: [Discord](https://discord.gg/example)

Good luck and start inviting and participating to win amazing prizes! 🎉
`;

    bot.sendMessage(chatId, mechanicsMessage, { parse_mode: 'Markdown' });
}

module.exports = { handleMechanics };