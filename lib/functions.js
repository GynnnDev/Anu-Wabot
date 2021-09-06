const fs = require('fs')
const fetch = require('node-fetch');
const util = require('util');
const cheerio = require('cheerio') ;
const ytSearch = require('yt-search');
const googleSearch = require('google-it')
const FileType = require('file-type');
const spin = require('spinnies');
const axios = require('axios');
const moment = require('moment-timezone');
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const googleImage = require('g-i-s');
const Crypto = require('crypto');
const fakeUa = require('fake-useragent');
const baileys = require('@adiwajshing/baileys');
const qrcode = require('qrcode');
const { exec, spawn, execSync } = require('child_process');

async function ambilSender(client, mess) {
if(!mess.isGroup) return;
let groupMetadata =  mess.groupData?.participants ? {...mess.groupData} : await client.groupMetadata(mess.from);
//groupMetadata.groupAdmins = groupMetadata.participants.filter(res => res.isAdmin);
groupMetadata.client = (groupMetadata.participants.find(res => res.jid == client.user.jid));
groupMetadata.client.isAdmin = groupMetadata?.client?.isAdmin || groupMetadata?.client?.isSuperAdmin;
groupMetadata.sender = (groupMetadata.participants.find(ros => ros.jid == mess.sender.jid));
groupMetadata.sender.isAdmin = groupMetadata?.sender?.isAdmin || groupMetadata?.sender?.isSuperAdmin;
mess.sender = await {...groupMetadata.sender,...mess?.sender}
mess.client = await {...groupMetadata.client,...mess?.client}
return {
	client: groupMetadata.client,
	sender: groupMetadata.sender
}
}


exports.Functions = class Functions {
constructor(){
this.qrcode = qrcode;
this.ffmpeg = ffmpeg;
this.fakeUa = fakeUa;
this.exec = exec;
this.spins = spin;
this.spawn = spawn;
this.baileys = baileys;
this.cheerio = cheerio;
this.moment = moment;
this.util = util;
this.fs = fs;
this.fetch = fetch;
this.axios = axios;
this.util = util;
this.FileType = FileType;
this.ytSearch = ytSearch;
this.chalk = chalk;
this.animate = new spin();
}

pad(num) {
return (num < 10 ? '0' : '') + num;
}

logLoading(teks){
if (!Object.keys(this.animate.spinners).includes("Loading")){
this.animate.add('Loading',{text:teks});
} else {
this.animate.update('Loading',{text:teks});
}
return;
}

logColor(text,color){
return chalk.keyword(color)(text);
}

parseResult(json,header = botinfo.botname,blacklist = []) {
let {upper,down,line,wings,list,head,body} = botinfo.unicode;
let result = upper+line.repeat(3)+head + ` *_${header}_*\n${body}\n`;
function parseResObj(jsonObj){
let pos = jsonObj;
let lama = {};
let objs = {};
function fill(){
for (let a in pos){
if (typeof pos[a] == 'object' && !Array.isArray(pos[a])){
objs = {...objs,...pos[a]}
} else if (typeof pos[a] == 'object' && Array.isArray(pos[a]) && typeof pos[a][0] == 'object' && !Array.isArray(pos[a][0])){
for (let d of pos[a]){
parseResObj(d)
}
} else {
let anu = typeof pos[a] == 'boolean'? pos[a] ? 'Ya':'Tidak': `${pos[a]}` == `` || `${pos[a]}` == undefined ? 'Tidak Di Ketahui' : `${pos[a]}`;
let name = a[0].toUpperCase()+a.slice(1).toLowerCase();
if (result.includes(name)) continue
name = name.replace(/\_/g,' ')
anu = anu.length > 20 ? anu.slice(0,20)+`......` : anu;
result += `${body}${list} *${name}:* ${anu}\n`;
}
}
for (let b in objs){
if (typeof objs[b] == 'object'){
pos = {...objs,...objs[b]};
} else {
pos = {...objs,[b]:objs[b]}
}
}
}
while(true){
let key1 = Object.keys(lama)
let key2 = Object.keys(pos)
  if (key1.length == key2.length) break;
  lama = pos;
  fill();
}
result = result.trim() + `\n`+down+line+head;
return result;
}
return parseResObj(json)
}

createExif(packname, authorname, filename) {
if (!filename) filename = 'data';
let json = {
'sticker-pack-id': 'CreateByAqul-RemasteredByZbin',
'sticker-pack-name': packname,
'sticker-pack-publisher': authorname,
};
let stringify = JSON.stringify(json).length;
let f = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
let code = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00];
if (stringify > 256) {
stringify = stringify - 256;
code.unshift(0x01);
} else {
code.unshift(0x00);
 }
let fff = Buffer.from(code);
const ffff = Buffer.from(JSON.stringify(json));
if (stringify < 16) {
stringify = stringify.toString(16);
stringify = '0' + stringify;
} else {
stringify = stringify.toString(16);
}
const ff = Buffer.from(stringify, 'hex');
const buffer = Buffer.concat([f, ff, fff, ffff]);
if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
fs.writeFileSync(`./tmp/${filename}.exif`, buffer);
return `./tmp/${filename}.exif`;
}
  
getTime(format,date) {
if (date){
return moment(date).locale('id').format(format);
} else {
return moment.tz('Asia/Jakarta').locale('id').format(format);
}
}

sizeName(number) {
let tags = ["", "K", "M", "G", "T", "P", "E"];
let tier = Math.log10(Math.abs(number)) / 3 | 0;
if (tier == 0) return number;
let tag = tags[tier];
let scale = Math.pow(10, tier * 3);
let scaled = number / scale;
let formatted = scaled.toFixed(1);
if (/\.0$/.test(formatted))
formatted = formatted.substr(0, formatted.length - 2);
return formatted + tag + 'b';
}

isUrl(url) {
	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
}

parseRegex(string) {
return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

count(sec) {
let hours = this.pad(Math.floor(sec / (60*60)));
let minutes = this.pad(Math.floor(sec % (60*60) / 60));
let seconds = this.pad(Math.floor(sec % 60));
return {hours,minutes,seconds};
}

metadataMsg(client,msg) {
let chatMeta = (mess) => {
mess = JSON.parse(JSON.stringify(mess))
mess.sender = {}
mess.realType = Object.keys(mess.message)[0]
mess.message = mess.realType == 'ephemeralMessage'?mess.message.ephemeralMessage.message:mess.message
mess.message = mess.realType == 'viewOnceMessage'? mess.message[mess.realType].message : mess.message
mess.type = Object.keys(mess.message)[0]
mess.data = typeof mess.message[mess.type]== "object" ? Object.keys(mess.message[mess.type]).includes("contextInfo") ? Object.keys(mess.message[mess.type]).concat(Object.keys(mess.message[mess.type].contextInfo)) : Object.keys(mess.message[mess.type]) : Object.keys(mess.message)
mess.string = (mess.type === baileys.MessageType.text) ? mess.message.conversation : (mess.data.includes('caption')) ? mess.message[mess.type].caption : (mess.type == baileys.MessageType.extendedText) ? mess.message[mess.type].text : (mess.type == 'buttonsResponseMessage') ? mess.message[mess.type].selectedButtonId : ''
mess.body = mess.message[mess.type]
mess.from = mess.key.remoteJid
mess.isGroup = mess.from.endsWith('g.us')
mess.sender.jid= mess.isGroup ? mess.participant ? mess.participant : client.user.jid : mess.key.remoteJid
mess.sender.name = client.contacts[mess.sender.jid] ? client.contacts[mess.sender.jid].name || client.contacts[mess.sender.jid].vname || client.contacts[mess.sender.jid].notify || client.contacts[mess.sender.jid].short || 'Unknown' : 'Unknown';
mess.client = {};
mess.client.name = client.user.name;
mess.client.jid = client.user.jid;
mess.mentionedJid = mess.data.includes('contextInfo') && mess.data.includes('mentionedJid')? mess.message[mess.type].contextInfo.mentionedJid : false;
mess.isText = mess.type == 'conversation' || mess.type == 'extendedTextMessage'
mess.isMedia = !mess.isText
mess.id = mess.key.id
mess.fromMe = mess.key.fromMe
mess.quotedMsg = mess.data.includes('contextInfo') && mess.data.includes('quotedMessage')?{key:{remoteJid:mess.from,fromMe:mess.message[mess.type].contextInfo.participant == client.user.jid,id:mess.message[mess.type].contextInfo.stanzaId},message:mess.message[mess.type].contextInfo.quotedMessage,participant: mess.message[mess.type].contextInfo.participant}:false
mess.isOwner = botinfo.ownerNumber.includes(mess.sender.jid.split('@')[0]) || mess.key.fromMe
mess.groupData = mess.isGroup ? client.chats.get(mess.from) : false
mess.groupData = mess.groupData ? {...mess.groupData,...mess.groupData?.metadata} : false;
delete mess.groupData.metadata;
delete mess.groupData.messages;
var x = ambilSender(client, mess)
mess.sender = {...x.sender,...mess?.sender}
mess.client = {...x.client,...mess?.client}


//function
mess.downloadMsg = async(save,auto_ext = true) => {
if (mess.isText) return;
let buffer = await client.downloadMediaMessage(mess);
let anu = await FileType.fromBuffer(buffer) || {ext:'bin',mime:'application/octet-stream'}
if (save){
save = auto_ext?save+'.'+anu.ext:save
fs.writeFileSync(save,buffer);
return {buffer,filename:save,...anu};
} else {
return {buffer,...anu};
}
};
mess.deleteMsg = async(forAll) => {
if (forAll) return await client.deleteMessage(mess.key.remoteJid,mess.key);
return await client.clearMessage(mess.key);
};
mess.loadQuotedMsg = async() => {
if (!mess.quotedMsg) return;
return await client.loadMessage(mess.from,mess.quotedMsg.key.id);
};
mess.reloadMsg = async() => {
return await client.loadMessage(mess.from,mess.key.id);
};
mess.resendMsg = async(jid,opt) => {
return await client.sendMessageFromContent(jid,mess.message,opt);
};
mess.forwardMsg= async(jid,force,opt) => {
let message = await client.generateForwardMessageContent(mess,force)
return client.sendMessageFromContent(jid,message,opt)
}
mess.modifyMsg = async(object) => {
return {...mess,...object}
}
mess.groupMetadata = async() => {
if(!mess.isGroup) return;
let groupMetadata = mess.groupData?.participants ? {...mess.groupData}: await client.groupMetadata(mess.from);
groupMetadata.groupAdmins = groupMetadata.participants.filter(res => res.isAdmin);
groupMetadata.client = (groupMetadata.participants.find(res => res.jid == client.user.jid));
groupMetadata.client.isAdmin = groupMetadata?.client?.isAdmin || groupMetadata?.client?.isSuperAdmin;
groupMetadata.sender = (groupMetadata.participants.find(ros => ros.jid == mess.sender.jid));
groupMetadata.sender.isAdmin = groupMetadata?.sender?.isAdmin || groupMetadata?.sender?.isSuperAdmin;
mess.sender = {...groupMetadata.sender,...mess?.sender}
mess.client = {...groupMetadata.client,...mess?.client}
return await groupMetadata;
}
mess.quotedMsgData = async() => {
if (chatData.quotedMsg){
return chatMeta(await mess.loadQuotedMsg())
} else {
return undefined
}
}
mess.quotedMsg = mess.quotedMsg ? chatMeta(mess.quotedMsg) : false
return mess;
};
let chatData = chatMeta(msg);
return chatData
}

async searchImage(query) {
return new Promise(async (resolve,reject) => {
await googleImage(query,resultImage)
function resultImage(error,result) {
if (error) reject(error)
if (result) resolve(result)
}
})
}

async delay(ms) {
 return new Promise(resolve => setTimeout(resolve, ms))
}

async start (){
console.clear()
let kali = fs.readFileSync('./src/kali.cat').toString()
console.log(this.logColor(kali,'silver'))
console.log(this.logColor(`Starting Running Bot......`,'silver'))
await this.delay(3000)
console.clear()
console.log(this.logColor(` _____   __    _             ____        __ 
/__  /  / /_  (_)___        / __ )____  / /_
  / /  / __ \\/ / __ \\______/ __  / __ \\/ __/
 / /__/ /_/ / / / / /_____/ /_/ / /_/ / /_  
/____/_.___/_/_/ /_/     /_____/\\____/\\__/  
                                            
`,'silver'))
await this.delay(1)
}


async googleSearch(query) {
return googleSearch({query})
}

}
exports.WAConnection = class WAConnection extends baileys.WAConnection {
		 async reply(mess, text, opt) {
		  return await this.sendMessage(mess.key.remoteJid, text, baileys.MessageType.extendedText, { quoted:mess, ...opt})
		  } 
     async getBuffer(path,save,auto_ext=true){
       let buffer = path.message ? await this.downloadMediaMessage(path) : Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path, { headers: { 'User-Agent': fakeUa()}})).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0);
       let anu = await FileType.fromBuffer(buffer) || {ext:'bin',mime:'application/octet-stream'}
       if (save) {
       save = auto_ext?save+'.'+anu.ext:save
       fs.writeFileSync(save,buffer)
       return {filename: save,buffer,...anu}
       } else {
        return {buffer}
       }
      }
     async sendMessageFromContent(jid,obj,opt={}){
     let prepare = await this.prepareMessageFromContent(jid,obj,opt)
    await this.relayWAMessage(prepare)
    return prepare
     }
     async fakeReply(jid,message,type,opt,fakeJid,participant,fakeMessage){
     return await this.sendMessage(jid,message,type,{
  quoted: { key: {fromMe: jid == this.user.jid, participant,remoteJid: fakeJid },
"message": fakeMessage}, 
...opt
})
     }
     async prepareSticker(path,exifFile){
       let buf = (await this.getBuffer(path)).buffer
       let { ext } = await FileType.fromBuffer(buf)
       if (!fs.existsSync("./tmp")) fs.mkdirSync('tmp')
       let fileName = `./tmp/${Date.now()}.${ext}`
       let output = fileName.replace(ext,'webp')
       fs.writeFileSync(fileName,buf)
       if (ext == 'webp'){
         if (exifFile){
         return new Promise((resolve,reject) => {
         exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`,(err) => { 
           if (err) throw err 
        let result = fs.readFileSync(output)
       fs.unlinkSync(output)
       resolve(result)
         })
         })
         } else {
       let result = fs.readFileSync(output)
       fs.unlinkSync(output)
       return result
         }
       }
       return new Promise(async(resolve,reject) => {
         await ffmpeg(fileName).input(fileName).on('error', function (err) { 
           fs.unlinkSync(fileName)
           reject(err)
}).on('end', function () {
if (exifFile) {
exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`,(err) => { 
if (err) return err
let result = fs.readFileSync(output)
fs.unlinkSync(fileName)
fs.unlinkSync(output)
resolve(result)
})
} else {
let result = fs.readFileSync(output)
fs.unlinkSync(fileName)
fs.unlinkSync(output)
resolve(result)
}
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(output)
       })
     }
     async sendImage(jid,path,caption,quoted,opt){
     let buff = (await this.getBuffer(path)).buffer
     return await this.sendMessage(jid,buff,'imageMessage',{quoted,caption,thumbnail: buff,...opt})
     }
     async sendVideo(jid,path,caption,quoted,opt){
     let buff = (await this.getBuffer(path)).buffer
     return await this.sendMessage(jid,buff,'videoMessage',{quoted,caption,...opt})
     }
     async sendLocation(jid,property,opt){
     return await this.sendMessageFromContent(jid,{locationMessage: property},opt)
     }
     async sendLiveLocation(jid,property,opt){
     return await this.sendMessageFromContent(jid,{liveLocationMessage:property},opt)
     }
     async sendProduct(jid,property,opt){
      return await this.sendMessageFromContent(jid,{productMessage:property},opt)
     }
      async sendSticker(jid,path,opt,exifFile){
       let prepare;
       if (exifFile){
         prepare = await this.prepareSticker(path,exifFile)
       } else {
       prepare = await this.prepareSticker(path)
       }
       return await this.sendMessage(jid,prepare,baileys.MessageType.sticker,opt)
     }
    }