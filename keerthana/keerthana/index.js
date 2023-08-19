'use strict'

/**
 * Copyright (c) 2021-2023 @Ajay O S
 *
 * CODE BY AJAY O S
 * Website: https://ajayos.github.io
 * GitHub Profile: https://github.com/Ajayos
 * Project Repository: https://github.com/Ajayos/keerthana
 * Project Website: https://ajayos.github.io/keerthana
 * Project Wiki: https://github.com/Ajayos/Keerthana/wiki
 * Issue Tracker: https://github.com/Ajayos/keerthana/issues
 * Bug Reports: https://github.com/Ajayos/keerthana/issues/new?assignees=&labels=bug&template=bug_report.md&title=
 *
 * Keerthana - an AI powered chatbot for WhatsApp
 *
 * Keerthana is a user-friendly and versatile chatbot that is designed to provide quick and
 * accurate responses to users on WhatsApp. Powered by artificial intelligence,
 * Keerthana can understand natural language queries and provide relevant answers. Whether
 * you need help with a particular task, want to know the weather forecast, or just want to
 * chat with a friendly bot, Keerthana has got you covered. The bot is fully customizable and
 * can be trained to provide personalized responses for specific use cases.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Apache License, Version 2.0 as published by
 * the Apache Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Apache License, Version 2.0 for more details.
 *
 * You should have received a copy of the Apache License, Version 2.0
 * along with this program.  If not, see <http://www.apache.org/licenses/>.
 *
 * Version: 19.5.6
 * Last Updated: February 19, 2023
 * Created: March 15, 2021
 *
 * For inquiries or support, please contact Ajay O S at ajayosakhub@gmail.com or 919188346721
 * Follow me on Twitter: @Ajayos
 *
 * CODE BY AJAY O S
 * @owner AJAY O S
 * @project @ajayos/keerthana
 * @version 1.0
 * @license Apache-2.0
 * @link https://github.com/ajayos/keerthana
 * @file index.js
 * @description keerthana base file for keerthana
 * @created 2023-03-20 10:18:06
 * @last-modified 2023-03-15 08:40:17
 *
 */



const { useDBAuthState, default: makeWASocket,DisconnectReason, makeCacheableSignalKeyStore,MessageRetryMap, OFFICIAL_DEV_JID, PLUGIN_URL, logger } = require('@ajayos/whatsapp-api');
const { log } = require('@ajayos/nodelogger');
const { setDB, getDB, deleteDB } = require('@ajayos/nodedb');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const getTime = require('@ajayos/nodetime')


var base_path = path.join(__dirname, '.');
var ajay_path = path.join(base_path, '..');
var node_path = path.join(ajay_path, '..');
var home_path = path.join(node_path, '..');
var plugin_path = path.join(home_path, '/plugins');
let Ammu;
var newpl = [];
var keerthana_commands = {};

async function run() {
    setDB('status', 'status', 'online');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await makePlugin()
    await Start();
}

async function Start(options) {
    if(options) {
        if(options.status)  log(options.status ? options.status : '', 'info');
        if(options.message) log(options.message ? options.message: '', "d");
    }
    try {
        const { state, saveCreds} = await  useDBAuthState();
        Ammu = makeWASocket({
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys),
        },
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
            message.buttonsMessage ||
            message.listMessage ||
            message.sendMessage ||
            message.templateMessage ||
            message.audioMessage ||
            message.videoMessage ||
            message.locationMessage ||
            message.contextInfo
            );
            if (requiresPatch) {
            message = {
                viewOnceMessage: {
                message: {
                    messageContextInfo: {
                    deviceListMetadataVersion: 2,
                    deviceListMetadata: {},
                    },
                    ...message,
                },
                },
            };
            }
            return message;
        }
        });
        Ammu.ev.on('creds.update', async() => {
            await saveCreds()
        });
        Ammu.ev.on('qr.update', async() => {
            log('Scan the QR Code for connect your whatsapp to keerhana')
        });
        Ammu.ev.on('new', async(is) => {
            if (is) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                await Ammu.sendMessage(OFFICIAL_DEV_JID, { text: 'Connect to keerhana' }, {});
                Start({message: 'Connected to keerthana', status: 'success'})
            }
        });
        Ammu.ev.on('connection.update', async(up) => {
            const {
                connection,
                lastDisconnect,
            } = up
            if (lastDisconnect && lastDisconnect.reason === DisconnectReason.badSession) {
                log('Bad Session', "e");
            }
            if (lastDisconnect && lastDisconnect.reason === DisconnectReason.loggedOut) {
                log('Loged Out', "e");
                deleteDB('Authentication');
                await Start({message: 'Loged Out', status: 'error'})
            }
            if (connection === 'open') {
                log('Connected', "d");
                const templateButtons = [
                    {index: 1, urlButton: {displayText: 'GITHUB', url: 'https://github.com/Ajayos/keerthana'}},
                    {index: 2, urlButton: {displayText: 'WEBPAGE', url: 'https://ajayos.github.io/keerthana/'}},
                    {index: 3, quickReplyButton: {displayText: '➤⃟🍒 ✮⃝KEERTHANA🎀⃟⃪➣  ➤⃟🍒', id: '➤⃟🍒 ✮⃝KEERTHANA🎀⃟⃪➣  ➤⃟🍒'}},
                ]
                var { hours, minutes, seconds, ampm, day, month, year, wish } = await getTime();
                var txt = `
╔═════════════════════❍
║ ➤⃟🍒 ✮⃝KEERTHANA🎀⃟⃪➣  ➤⃟🍒
╚═════════════════════❍
╔═════════════════════❍
║ ❏   DEVELOPER
║ ❏   Ajay o s
║ ❏   @919188346721
║ ❏   https://github.com/Ajayos
╚═➤⃟🍒═➤⃟🍒═➤⃟🍒═➤⃟🍒═❍
╔═════════════════════❍
║
║□  TIME🕰 : ${hours}:${minutes}:${seconds} ${ampm}
║□  DATE🗓 : ${day}/${month}/${year}
║□  AI🤖  : True
║□  MODE  : PM MODE
║□  GROUP : PRIVATE
║□  WORK TYPE : AI MODE
║
╚═➤⃟🍒═➤⃟🍒═➤⃟🍒═➤⃟🍒═❍`
                const templateMessage = {
                    
                }
                await sendMessage(OFFICIAL_DEV_JID, { text: txt, footer: '➤⃟🍒 ✮⃝KEERTHANA🎀⃟⃪➣ ➤⃟🍒 \n👨‍💻CODE BY 🕊️★⃝AJAY O S©️🧚‍♂️',  mentions: ['919188346721@s.whatsapp.net', '917510153501@s.whatsapp.net']}, {});
                await sendMessage(Ammu.user.id, { text: txt, footer: '➤⃟🍒 ✮⃝KEERTHANA🎀⃟⃪➣ ➤⃟🍒 \n👨‍💻CODE BY 🕊️★⃝AJAY O S©️🧚‍♂️', templateButtons: templateButtons, mentions: ['919188346721@s.whatsapp.net', '917510153501@s.whatsapp.net']}, {});
                await sendMessage('919562388758@s.whatsapp.net', { text: 'hey'}, {});
                await sendMessage('919562388758@s.whatsapp.net', templateMessage, {});
                await pluginsync()
                log('Synced', "i");
            }
            if (connection === 'close') {
              log('Disconnected', "d");
            }
        });

        Ammu.ev.on('messages.upsert', async(up) => {
            try {
                const qt = up.messages[0]
                up.isLatest = true
                if(up && up.type === 'notify') {
                    for(const msg of up.messages) {
                        if( msg.key.remoteJid !== 'status@broadcast') {
                            const id = msg.key.remoteJid
                            const fromMe = msg.key.fromMe;
                            const pushName = msg.pushName
                            const messageType = Object.keys(msg.message)[0]
                            const type = Object.keys(msg.message)[0];
                            const content = JSON.stringify(msg.message);
                            const body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || (type == 'listResponseMessage' ? msg.msg.singleSelectReply.selectedRowId : '') || msg.msg.text || msg.msg.caption || msg.msg || '') : '';
                            const command = body.trim().split(/ +/).shift().toLowerCase();
                            const rmg = body.trim().split(/ +/).slice(1);

                            const out = {
                                id: id,
                                cmd: command,
                                rmg: rmg,
                                from: id,
                                me: Ammu.user.id.split(':')[0] + '@s.whatsapp.net',
                                qt: qt,
                                fromMe: fromMe,
                                pushName: pushName,
                                messageType: messageType,
                                content: content,
                                isGroup: id.endsWith('@g.us'),
                                isPm: id.endsWith('@s.whatsapp.net'),
                                isMedia: messageType === 'imageMessage' || messageType === 'videoMessage' || messageType === 'audioMessage',
                                isText: messageType === 'conversation' || messageType === 'extendedTextMessage',
                                isImage: messageType === 'imageMessage',
                                isVideo: messageType === 'videoMessage',
                                isAudio: messageType === 'audioMessage',
                                isSticker: messageType === 'stickerMessage',
                                isDocument: messageType === 'documentMessage',
                                isLocation: messageType === 'locationMessage',
                                isExtendedText: messageType === 'extendedTextMessage',
                                isButtons: messageType === 'buttonsResponseMessage',
                                isList: messageType === 'listResponseMessage',
                                isButton: messageType === 'templateButtonReplyMessage',
                                isProduct: messageType === 'productMessage',
                                isContacts: messageType === 'contactsArrayMessage',
                                isContactsArray: messageType === 'contactsArrayMessage',
                                isLiveLocation: messageType === 'liveLocationMessage',
                                isListMessage: messageType === 'listMessage',

                                isQuoted: messageType === 'extendedTextMessage',
                                isQuotedImage: messageType === 'extendedTextMessage' && content.includes('imageMessage'),
                                isQuotedVideo: messageType === 'extendedTextMessage' && content.includes('videoMessage'),
                                isQuotedAudio: messageType === 'extendedTextMessage' && content.includes('audioMessage'),
                                isQuotedSticker: messageType === 'extendedTextMessage' && content.includes('stickerMessage'),
                                isQuotedDocument: messageType === 'extendedTextMessage' && content.includes('documentMessage'),
                                isQuotedLocation: messageType === 'extendedTextMessage' && content.includes('locationMessage'),
                                isQuotedExtendedText: messageType === 'extendedTextMessage' && content.includes('extendedTextMessage'),
                                isQuotedButtons: messageType === 'extendedTextMessage' && content.includes('buttonsResponseMessage'),
                                isQuotedList: messageType === 'extendedTextMessage' && content.includes('listResponseMessage'),
                                isQuotedButton: messageType === 'extendedTextMessage' && content.includes('templateButtonReplyMessage'),
                                isQuotedProduct: messageType === 'extendedTextMessage' && content.includes('productMessage'),
                                isQuotedSticker: messageType === 'extendedTextMessage' && content.includes('stickerMessage'),
                                isQuotedContacts: messageType === 'extendedTextMessage' && content.includes('contactsArrayMessage'),
                                isQuotedContactsArray: messageType === 'extendedTextMessage' && content.includes('contactsArrayMessage'),
                                isQuotedLiveLocation: messageType === 'extendedTextMessage' && content.includes('liveLocationMessage'),
                                isQuotedImageMessage: messageType === 'extendedTextMessage' && content.includes('imageMessage'),
                                isQuotedVideoMessage: messageType === 'extendedTextMessage' && content.includes('videoMessage'),
                                isQuotedAudioMessage: messageType === 'extendedTextMessage' && content.includes('audioMessage'),
                                isQuotedDocumentMessage: messageType === 'extendedTextMessage' && content.includes('documentMessage'),
                                isQuotedListMessage: messageType === 'extendedTextMessage' && content.includes('listMessage'),
                            }
                            if(command) {
                                await cmd_control(command, out)
                            }
                        }
                    }
                }
            } catch (e) {
                log(e, 'error');
            }
        });
    } catch (error) {
        log(error)
    }
}


/**
 *
 * @param {string} jid whre you want to send message in whatsapp
 * @param {*} message  message type and message
 * @param {*} options  options for message
 */

async function sendMessage(jid, message = {}, options = {}) {
    await Ammu.sendMessage(jid, message, options)
}



/**
 *
 * @param {text} command to to reply
 * @param {any} callback to be called when reply
 */
async function bot(command, callback)  {
    try {
        keerthana_commands[command] = callback;
    } catch (e) {
        throw e;
    };
};

async function cmd_control(cmd, out) {
    try {
        if(cmd === 'keerthana') {
            if(out.rmg) {
                switch(out.rmg[0]) {
                    case 'install': {
                        if(out.rmg[1]) {
                            installPlugin(out.rmg[1], out);
                        }
                    }
                    break;
                    case 'uninstall': {
                        if(out.rmg[1]) {
                            uninstallPlugin(out.rmg[1], out);
                        }
                    }
                    break;
                }
            }
        } else {
            executeCommand(cmd, out);
        }
    } catch (error) {
    }
}

/**
 *
 * @param {text} command to replay the command
 * @param {any} exp export datas to command
 */
const executeCommand = (command, exp) => {
    if (!keerthana_commands[command]) return
    keerthana_commands[command](exp);
};

// restart function
/**
 *
 * @param {any} options
 */
async function Restart(options = {}) {
    log('Restarting...', 'info');
    Start({ restart: true, message: options.message ? options.message : "RESTARTED", status: options.status ? options.status : 'restart' });
}

async function makePlugin() {
    log('Installing plugins...', 'info');
    if(!fs.existsSync(plugin_path)) fs.mkdirSync(plugin_path);
    var plugins = await getDB('plugins');
    if(!plugins) return false;
    var m = false;
    newpl = [];
    plugins.map(async (plugin) => {
        if (!fs.existsSync(plugin_path + '/' + plugin.rowName + '.js')) {
            m = true;
            newpl.push(plugin.rowName);
            await fs.promises.writeFile(`./plugins/${plugin.rowName}.js`, plugin.data);
            await require(plugin_path + `/${plugin.rowName}.js`);
        } else {
            await require(plugin_path + `/${plugin.rowName}.js`);
        }
    })
    if(m) {
        var pls = ' ';
        for (var pl of newpl) {
            pls += pl + ', ';
        }
        return true

        //return ({ restart: true, message: '✅ new Plugins  [' + pls + '] has been installed ', status: 'success'});
    } else return false;
}

async function installPlugin(name, out) {
    try {
        // check if the plugin is already installed
        if (fs.existsSync(path.join(plugin_path, '/' + name + '.js'))) {
            await axios.get('https://ajayos.github.io/keerthana-plugins/' + name + '.js').then(async (res) => {
                if (res.status === 200) {
                    const oldfile = await getDB('plugins', name)
                    if(oldfile === res.data) {
                        await sendMessage(out.from, { text: 'The plugin has been already installed :)'}, {quoted: out.qt})
                    } else {
                        await setDB('plugins', name, res.data);
                        await sendMessage(out.from, { text: 'The plugin has been  updated successfully ;)'}, {quoted: out.qt})
                    }
                }
            }).catch(async(err) => {
                log('Error: ' + err.message, 'error');
                await sendMessage(OFFICIAL_DEV_JID, {text: err.message}, {quoted: out.qt});
            });
        } else {
            await axios.get('https://ajayos.github.io/keerthana-plugins/' + name + '.js').then(async (res) => {
                if (res.status === 200) {
                    await setDB('plugins', name, res.data);
                    await sendMessage(out.from, { text: `The plugin ${name} has been  updated successfully ;)`}, {quoted: out.qt})
                }
            }).catch(async(err) => {
                log('Error: ' + err.message, 'error');
                await sendMessage(OFFICIAL_DEV_JID, {text: err.message}, {quoted: out.qt});
            });
        }
    } catch (err) {
        log(err, 'e');
    }
    await axios.get('https://ajayos.github.io/keerthana-plugins/' + name + '.js').then(async (res) => {
        if (res.status === 200) {
            await setDB('plugins', name, res.data);
            await makePlugin();
            message = 'New Plugin ' + name + ' has been installed'
        }
    }).catch(async(err) => {
        log('Error: ' + err.message, 'error');
        await sendMessage(OFFICIAL_DEV_JID, {text: ''})
        message = 'install plugin Error: ' + err.message;
    });
    return message;
}

async function uninstallPlugin(name) {
    await deleteDB('plugins', name);
    fs.unlinkSync(plugin_path + '/' + name + '.js');
    await makePlugin();
    message ='Plugin ' + name + ' has been uninstalled'
    return message;
}

async function pluginsync() {
    log('Sync plugins...', 'info');
    if(!fs.existsSync(plugin_path)) return;
    fs.readdirSync(plugin_path).forEach(plugin => {
        if(path.extname(plugin).toLowerCase() === '.js') {
            require(plugin_path + `/${plugin}`);
        }
    });
}

module.exports = {
    sendMessage,
    bot,
    run,
}
