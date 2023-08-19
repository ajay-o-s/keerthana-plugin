

const { bot, sendMessage } = require('@ajayos/keerthana');

bot('hi', async (message) => {
    await sendMessage(message.from, { text: 'Hello' });
});

bot('hey', async (message) => {
    await sendMessage(message.from, { text: 'Hello-hello' });
});

