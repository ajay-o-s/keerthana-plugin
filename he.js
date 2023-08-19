
const { bot, sendMessage } = require('@ajayos/keerthana');

bot('ooo', async (message) => {
    await sendMessage(message.from, { text: '3ooo' });
});


bot('o', async (message) => {
    await sendMessage(message.from, { text: '1o' });
});
bot('oo', async (message) => {
    await sendMessage(message.from, { text: '2oo' });
});
bot('oooo', async (message) => {
    await sendMessage(message.from, { text: '40ooo' });
});


