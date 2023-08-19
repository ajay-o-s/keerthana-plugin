const { getDB, setDB, deleteDB } = require('@ajayos/nodedb');
const fs = require('fs');
const { log } = require('@ajayos/nodelogger');

var data = `
const { bot, sendMessage } = require('@ajayos/keerthana');

 bot('hlo', async (message) => {
    await sendMessage(message.from, { text: 'Hello its hello' });
});

bot('hehe', async (message) => {
    await sendMessage(message.from, { text: 'hehe Hello hello' });
});

`

var hey = `

const { bot, sendMessage } = require('@ajayos/keerthana');

bot('hi', async (message) => {
    await sendMessage(message.from, { text: 'Hello' });
});

bot('hey', async (message) => {
    await sendMessage(message.from, { text: 'Hello-hello' });
});

`

setDB('plugins','hey', data);
setDB('plugins','hi', hey)//.then((res) => {
//    fs.writeFileSync('./plugins/' + 'hi' + '.js', res);
//})



async function syncPlugin() {
    log('⬇️Installing plugins...', 'info');
    var plugins = await getDB('plugins');
    plugins.map(async (plugin) => {
        console.log(plugin.rowName);
        if(!fs.existsSync('./plugins')) fs.mkdirSync('./plugins');
        if (!fs.existsSync('./plugins/' + plugin.rowName + '.js')) {
            fs.writeFileSync('./plugins/' + plugin.rowName + '.js', plugin.data);
            require('./plugins/' + plugin.rowName + '.js');
        }
    })
}
//installPlugin()

//    if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
//        console.log(plugin.dataValues.name);
//        var response = await got(plugin.dataValues.url);
//        if (response.statusCode == 200) {
//            fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
//            require('./plugins/' + plugin.dataValues.name + '.js');
//        }
//    }
//});


