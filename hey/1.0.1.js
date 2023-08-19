
const { bot, sendMessage } = require('../');

bot('ooo', async (message) => {
    await sendMessage(message.from, { text: '1.01 hi hey' });
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


