
const { bot, sendMessage } = require('@ajayos/keerthana');

bot('mk', async (message) => {
    await sendMessage(message.from, { text: 'Hello its hello' });
});

bot('mr', async (message) => {
    await sendMessage(message.from, { text: 'hehe Hello hello' });
});

