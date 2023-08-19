
const { bot, sendMessage } = require('@ajayos/keerthana');

 bot('hii', async (message) => {
    await sendMessage(message.from, { text: 'Hello' });
});

bot('heey', async (message) => {
    await sendMessage(message.from, { text: 'Hello hello' });
});


