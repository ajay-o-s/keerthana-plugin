
const { bot, sendMessage } = require('@ajayos/keerthana');

 bot('hlo', async (message) => {
    await sendMessage(message.from, { text: 'Hello its hello' });
});

bot('hehe', async (message) => {
    await sendMessage(message.from, { text: 'hehe Hello hello' });
});

