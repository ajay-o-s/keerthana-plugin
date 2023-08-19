'use strict'
const { fetchLatestBaileysVersion, default: WASocket, makeWASocket, makeInMemoryStore, BufferJSON, initInMemoryKeyStore, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, proto, downloadContentFromMessage, MessageType, MessageOptions, Mimetype } = require("@adiwajshing/baileys")
const { Boom } = require('@hapi/boom');
const Pino = require('pino');
const fs = require('fs');
const { writeFile } = require('fs/promises');
const axios = require("axios");
const moment = require("moment-timezone");
const { format } = require("util");
const { state, saveState } = useSingleFileAuthState('server/Ammu.json');
const kerthana = 'KERTHANA';


async function BlackSudo () {

    const { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`Using: ${version}, newer: ${isLatest}`);
    const Ammu = WASocket({
		printQRInTerminal: true,
		auth: state,
		logger: Pino({ level: "silent" }),
		version: version,
        	browser: ['KERTHANA', 'Safari','3.0'],
	});
    Ammu.ev.on("creds.update", saveState);
    Ammu.ev.on("connection.update", async (up) => {
		const { lastDisconnect, connection } = up;
		if (connection) {
			console.log("Connection Status: ",connection);
            console.log('Server 7510 started');
		};
        if (connection === 'open') return Ammu.sendMessage('919188346721@s.whatsapp.net',{ text: 'IAM ONLINE '});
		if (connection === "close") {
			let reason = new Boom(lastDisconnect.error).output.statusCode;
			if (reason === DisconnectReason.badSession) {
				console.log(`Bad Session File, Please Delete and Scan Again`);
				Ammu.logout();
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				Ammu.logout();
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Please Delete and Scan Again.`);
				Ammu.logout();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
			} else {
				Ammu.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
			};
		};
    });

    
    Ammu.ev.on("messages.upsert", async (mp) => {
        try {
            if(!mp.messages) return
            const msg = mp.messages[0]
            if (!msg.message) return
            msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message;
            if (msg.key && msg.key.remoteJid === 'status@broadcast') return
            if (msg.key.id.startsWith('BAE5') && msg.key.id.length === 16) return
            const fromMe = msg.key.fromMe;
            const content = JSON.stringify(msg.message);
            const from = msg.key.remoteJid;
            const type = Object.keys(msg.message)[0];
            const body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || (type == 'listResponseMessage' ? msg.msg.singleSelectReply.selectedRowId : '') || msg.msg.text || msg.msg.caption || msg.msg || '') : '';
            const command = body.trim().split(/ +/).shift().toLowerCase();
            const rmg = body.trim().split(/ +/).slice(1);
            const botNumber = Ammu.user.id.split(':')[0] + '@s.whatsapp.net';
            const isGroup = from.endsWith('@g.us');
            
            await Ammu.sendPresenceUpdate('unavailable', from)
            const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid;
            const sudon = ['919188346721','917510153501'];
            const SUDO = sudon.includes(sender.split('@')[0]);
            const pushname = msg.pushName === undefined ? sender.split('@')[0]  : msg.pushName; // 

            var d = new Date();
            const hrs = d.getHours().toString().padStart(2, 0);
            const min = d.getMinutes().toString().padStart(2, 0);
            const sec = d.getSeconds().toString().padStart(2, 0);
            const day = d.getDate();
            const mon = d.getMonth() + 1;
            const year = d.getFullYear();
            const ampm = hrs >= 12 ? 'PM' : 'AM';
            const ihrv = hrs <= '09' ? hrs.split('0')[1] : hrs;
            const ihra = ['12','1','2','3','4','5','6','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10','11','12'];
            const ihr = ihra[ihrv];
            const gn_text = ["😘𝙂𝙤𝙤𝙙 🙈𝙣𝙞𝙜𝙝𝙩 💫✨","🤗𝓖𝓸𝓸𝓭 🧚‍♀𝓷𝓲𝓰𝓱𝓽 ❄️✨","🌌❡០០ᖱ 🌙⩎ɨ❡ϦƬ 🌎","😘ցօօժ ⭐️ղíցհԵ 💝","🌃Ꮐᝪᝪᗞ 🙈ᑎᏆᏀᕼᎢ 💫✨","꧁༒♛ good nιgнт ♛༒꧂","𝓰𝓸𝓸𝓭 𝓷𝓲𝓰𝓱𝓽💕","ğôõd○ňîğht♧◇♤♡", "¥${☆.ĞØĐĎ ÑÎĢHŤ.☆}$¥", "❤️* *ǤØØĐ ŇƗǤĦŦ* *❤️💕🥰", "•𝓝𝓲𝓰𝓱𝓽☾", "꧁༺ ***** *ǤØØĐ ŇƗǤĦŦ*  ***** ༻", "❀◕ ‿ ◕❀₲ØØĐ ℕ𝕀𝔾𝕙𝕋❀◕ ‿ ◕❀", "🍃ᴳᴼᴼᴰ🍁ɴɪɢʜᴛ🥀", "GᴏᴏᴅNɪɢʜᴛ ☾", "꧁꧁✞ঔৣ۝☬  ☬۝ঔৣ🅶🅾🅾🅳🅽🅸🅶🅷", "●●●●●●♤♡ğøøđ ňīğhț♤♡●●●●●●●》》", "~*⏥____♡|•गुᴅ͢• • 🇳𝐈𝐆𝐇𝐓⃠•", "Good▄︻̷̿┻̿═━一night", "❤️ 𝔾𝕠𝕠𝕕 ℕ𝕚𝕘𝕙𝕥 ❤️", "♥●❥╚»♛«╝ 𝙣𝙞𝙜𝙝𝙩 ╚»♛«╝●❥♥", "•.,¸¸,.•¯💖 *Ǥ𝕠όᵈ 𝓝𝔦ⒼнŦ*", "ทۖ เ🅖█▬█ 𝔱", "✨𝔾𝕠𝕠𝕕 ℕ𝕚𝕘𝕙𝕥 ☽⋆✨", "GOoDnIgHt😗💛", "G⭐⭐D...NI:GHT", "♡✨ǤØØĐ ŇƗǤĦŦ✨♡", "♡ĞØØĐ ŇĪĞHȚ♡", "||____G⭕⭕d Night____||", "♡▪G•O•O•D~N•I•G•H•T▪♡", "●⃝ᶫᵒꪜe☯ᴳᶹʳᶹ᭄●⁴³", "❤️* *ǤØØĐ ŇƗǤĦŦ* *",  "•°•°•°GOOD NIGHT°•°•°•", "❤️good night✨⚡", "ᴳᴼᴼᴰ|ɴɪɢʜᴛ⋆", "Night ❤️💕🥰", "🍃ᴳᴼᴼᴰ🍁ɴɪɢʜᴛ", "Good Night 😴😴", "°~||...♪♪G∅∅D Π¡gH†♪♪...||~°", "Good night 😴🥱", "👻 Good Night 👻"];
            const gm_text = ["❀🍃Good❀ ❀morning❀🥰❀","☘️𝐺𝑜𝑜𝑑 🌅𝑚𝑜𝑟𝑛𝑖𝑛𝑔 💐","🍃𝙶𝚘𝚘𝚍 🌻𝚖𝚘𝚛𝚗𝚒𝚗𝚐 🥰","🍀𝗚𝗼𝗼𝗱 😘𝗺𝗼𝗿𝗻𝗶𝗻𝗴 🌸","🌻𝓖𝓸𝓸𝓭 𝓶𝓸𝓻𝓷𝓲𝓷𝓰 💞","🌼🅖🅞🅞🅓 🅜🅞🅡🅝🅘🅝🅖 🐶","🍃Ⓖⓞⓞⓓ 🌈ⓜⓞⓡⓝⓘⓝⓖ 🥰",   "♥ 🌅 𝐆𝔬𝓸𝕕 𝐦σＲŇ𝓘η𝑔 🌤️ 🐣ൠ",   "💖´ •.¸♥¸.•* G͛⦚o͛⦚o͛⦚d͛⦚ M͛⦚o͛⦚r͛⦚n͛⦚i͛⦚n͛⦚g͛⦚ *•.¸♥¸.•´💖", "˜”°•.˜”°• Good Morning •°”˜.•°”˜",  "(༒G●●d M●RNINg༒)", "꧁༺ɢօօɖ ʍօʀռɨռɢ༻꧂", "꧁ɢȏȏԀ༒ṃȏяṅıṅɢ࿐", "꧁༒☬Good Morning ☬༒꧂", "⚡GØoͥdmͣoͫrήiήg⚡", "★🅶🅾🅾🅳 🅼🅾🆁🅽🅸🅽🅶★", "🄶🄾🄾🄳∞︎︎♡🄼🄾🅁🄽🄸🄽🄶",  "⚡꧁ɢȏȏԀ༒ṃȏяṅıṅɢ࿐,⚡","❣️ Ｇｏｏｄ Ｍｏｒｎｉｎｇ ❣️", "🌹 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ 🌹", "🌅 𝔾𝕠𝕠𝕕 𝕄𝕠𝕣𝕟𝕚𝕟𝕘 🌤️", "🌄 𝒢𝑜𝑜𝒹 𝑀𝑜𝓇𝓃𝒾𝓃𝑔 🌟", "🌅 ₲ØØĐ ₥ØⱤ₦ł₦₲ 🌻", "💕 GӨӨD MӨЯПIПG 💕", "🌅 𝙶𝚘𝚘𝚍 𝙼𝚘𝚛𝚗𝚒𝚗𝚐 🌤️", "🌅 𝓖𝓸𝓸𝓭 𝓜𝓸𝓻𝓷𝓲𝓷𝓰 🌤️",  "🥰 gσσ∂ мσяηιηg 🌅", "💐 GððÐ Mðrñïñg 💐", "🌹 Good Morning 🌹", "🌹 Gₒₒd ₘₒᵣₙᵢₙg 🌹", "🌅 ᴳᵒᵒᵈ ᴹᵒʳⁿⁱⁿᵍ 🌤️", "🌅 𝔊𝔬𝔬𝔡 𝔐𝔬𝔯𝔫𝔦𝔫𝔤 🌤️", "🌺 𝕲𝖔𝖔𝖉 𝕸𝖔𝖗𝖓𝖎𝖓𝖌 🌺",  "🌅️ ɓuıuɹoW poo⅁⛅"];
	        const gf_text = ["ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞","𝓖𝓸𝓸𝓭 𝓐𝓯𝓽𝓮𝓻𝓷𝓸𝓸𝓷", "𝔾𝕠𝕠𝕕 𝔸𝕗𝕥𝕖𝕣𝕟𝕠𝕠𝕟", "𝒢ℴℴ𝒹 𝒜𝒻𝓉ℯ𝓇𝓃ℴℴ𝓃", "𝓖𝓸𝓸𝓭 𝓐𝓯𝓽𝓮𝓻𝓷𝓸𝓸𝓷"];
	        const ge_text = ["ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ 🌥","𝓖𝓸𝓸𝓭 𝓮𝓿𝓮𝓷𝓲𝓷𝓰", "𝔾𝕠𝕠𝕕 𝕖𝕧𝕖𝕟𝕚𝕟𝕘", "𝕲𝖔𝖔𝖉 𝖊𝖛𝖊𝖓𝖎𝖓𝖌", "𝒢ℴℴ𝒹 ℯ𝓋ℯ𝓃𝒾𝓃ℊ", "𝓖𝓸𝓸𝓭 𝓮𝓿𝓮𝓷𝓲𝓷𝓰"];
            var gn_len = gn_text.length;
            var gm_len = gm_text.length; 
		    var gf_len = gf_text.length;
            var ge_len = ge_text.length;
	        var gn = Math.floor(gn_len*Math.random());
	        var gm = Math.floor(gm_len*Math.random());
		    var gf = Math.floor(gf_len*Math.random());
	        var ge = Math.floor(ge_len*Math.random());
            var wish_data = hrs < 12 ? gm_text[gm] : hrs <= 17 ? gf_text[gf] : hrs <= 19 ? ge_text[ge] : hrs <= 24 ? gn_text[gn] : gm_text[gm];
            var wish = '*'+wish_data+'*';
            function sleep(m) {return new Promise(r => setTimeout(r, m*60000));};
            

            switch (command) {
                case 'sent':
                case 'send':
                case 'st':
                case 'sd':
                case 'snt':
                case 'snd':
                case 'tha':
                    if (msg.message.extendedTextMessage.contextInfo.remoteJid !== 'status@broadcast') return
                    var sent_id = msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage ? 'video' : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage ? 'image' : false;
                    var caption = msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage ? msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.caption : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage ? msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.caption : '';
                    var l_caption = caption == '' ? 0 : 1;
                    if (l_caption == 0) {
                        var buttons = [
                            {buttonId:',message_to_kerthana', buttonText: {displayText: 'KERTHANA'}, type: 1}
                        ]
                    } else {
                        var buttons = [
                            {buttonId:',message_to_kerthana', buttonText: {displayText: 'KERTHANA'}, type: 1},
                            {buttonId:',caption '+caption, buttonText: {displayText: 'CAPTION'}, type: 1}
                        ]
                    } 
                    if (sent_id == 'video') {
                        var stream = await downloadContentFromMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, 'video')
                        let buffer = Buffer.from([])
                        for await(var chunk of stream) {buffer = Buffer.concat([buffer, chunk])}
                        var buttonMessage = { video: buffer, caption: caption, footer: 'KERTHANA', buttons: buttons,headerType: 4}
                        Ammu.sendMessage(from, buttonMessage,{quoted: {key: {fromMe: false, participant: msg.message.extendedTextMessage.contextInfo.participant, ...(from ? { remoteJid: "status@broadcast","id":msg.message.extendedTextMessage.contextInfo.stanzaId} : {})}, message: { "videoMessage": msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage}},})
                    } else if (sent_id == 'image') {
                        var stream = await downloadContentFromMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await(var chunk of stream) {buffer = Buffer.concat([buffer, chunk])}
                        var buttonMessage = { image: buffer, caption: caption, footer: 'KERTHANA', buttons: buttons,headerType: 4}
                        Ammu.sendMessage(from, buttonMessage,{quoted: {key: {fromMe: false, participant: msg.message.extendedTextMessage.contextInfo.participant, ...(from ? { remoteJid: "status@broadcast","id":msg.message.extendedTextMessage.contextInfo.stanzaId} : {})}, message: { "imageMessage": msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage}},})
                    }
                break
                case ',statusgrouplink':
                    await Ammu.sendMessage(from, { text: 'https://chat.whatsapp.com/J4kb3vqvXRd9D2U9rnZR5m'},{quoted:msg})
                break
                case ',message_to_kerthana':
                    await Ammu.sendMessage(from, { text: 'https://wa.me/message/EKF2P6FEGNLHI1'},{quoted:msg})
                    await Ammu.sendMessage('917510153501@s.whatsapp.net', { text: ',message_kerthana '+from.split('@')[0]})
                break
                case ',caption':
                    await Ammu.sendMessage(from, { text: rmg },{quoted:msg})
                break
                case 'status':
                    if(!msg.key.fromMe) return
                    if(msg.message.extendedTextMessage.contextInfo.quotedMessage == null) return
                    var sent_id = msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage ? 'video' : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage ? 'image' : false;
                    var caption = msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage ? msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.caption : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage ? msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.caption : '';
                    var l_caption = caption == '' ? 0 : 1;
                    var lsmd = rmg == '' ? ' ': rmg == 0 ? ' ':rmg == 1 ? l_caption == 0 ? '' : l_caption : rmg !==''? rmg :'';
                    if (sent_id == 'video') {
                        var stream = await downloadContentFromMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, 'video')
                        let buffer = Buffer.from([])
                        for await(var chunk of stream) {buffer = Buffer.concat([buffer, chunk])}
                        await Ammu.sendMessage('917510153501@s.whatsapp.net', { video:buffer,caption: lsmd ,gifPlayback: false})
                        await Ammu.sendMessage('status@broadcast', { video:buffer,caption: lsmd })
                        
                    } else if (sent_id == 'image') {
                        var stream = await downloadContentFromMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await(var chunk of stream) {buffer = Buffer.concat([buffer, chunk])}
                        var reactionMessage = {react: {text: "😁",key: msg.key}}
                        Ammu.sendMessage(from, reactionMessage);
                        await Ammu.sendMessage('status@broadcast', { image:buffer,caption: lsmd})
                    }
                break
                case 'log':
                    console.log(msg.message.extendedTextMessage.contextInfo)
                    console.log(rmg)
                break
                default: 
            }

        } catch (e) {
            e = String(e);
            console.log('[ERROR] => ',e);
            Ammu.sendMessage('919188346721@s.whatsapp.net',{ text: '[ERROR] => ' + e});
        }

    });
}
BlackSudo ()