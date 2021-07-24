const fs = require('fs')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const util = require('util')
const brainly = require('brainly-scraper')
const axios = require('axios')
const cheerio = require('cheerio') 
const googleImage = require('g-i-s')
const yts = require('yt-search')
const ggs = require('google-it')
const FileType = require('file-type')
const syntax = require('syntax-error')
const typeMsg = require('@adiwajshing/baileys').MessageType
const functions = require('./lib/functions.js')
const WAConnection = functions.WAConnection(require('@adiwajshing/baileys').WAConnection)
const { WAMessageProto, Presence, Mimetype, GroupSettingChange } = require('@adiwajshing/baileys')
const { exec,execSync,spawn } = require('child_process')

//Json Place
global.botinfo = JSON.parse(fs.readFileSync('./botInfo.json'))
global.userDb = JSON.parse(fs.readFileSync('./src/user.json'))
global.groupDb = JSON.parse(fs.readFileSync('./src/group.json'))

//The Brain Of All
async function starts(){
const client = new WAConnection()
client.version = [2,2119,6]
client.browserDescription = ["Zbin-Bot", "Desktop", "3.0"]
client.logger.level = 'warn'
client.on('qr', () => { 
console.log(this)
})

fs.existsSync('./session.json') &&
client.loadAuthInfo('./session.json')

client.on('connecting', () => { 
console.log('Connecting...')
})
client.on('open', () => {
console.log('connected')
fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
}) 

await client.connect({timeoutMs: 30*1000})

client.sendMessage(`6281910263857@s.whatsapp.net`,'Bot Running...','conversation')

client.on('chat-update',async(chat) => {
try {
if (!chat.hasNewMessage) return
msg = chat.messages.array[0]
if (!Object.keys(msg).includes('message')) return
if (msg.key && msg.key.remoteJid == 'status@broadcast') return
if (msg.key.id.length !== 32) return 
msg = functions.metadataMsg(client,msg)
const {sender,from,isGroup,isText,mentionedJid,quotedM,MsgType,MsgRealType,MsgData} = msg.messageData
const {quotedMsgData,groupData,StringMsg,message,key} = msg
const isOwner = botinfo.ownerNumber.includes(sender.split('@')[0]) || msg.key.fromMe
const prefixes = new RegExp(`^${botinfo.prefix.join('|')}`)
const isCmd = prefixes.test(StringMsg)
const command = (isCmd && StringMsg.replace(prefixes,'').toLowerCase().split(' ').filter(resp => resp !== '')[0])
const commandQ = command && StringMsg.replace(prefixes,'').replace(new RegExp(`${command}`,'i'),'')
stringPref = StringMsg.replace(commandQ,'').replace(command,'')
const args = StringMsg.split(' ').filter(resp => resp !== '')

switch(true){
case /^>/i.test(msg.StringMsg):
if (!isOwner) return
try{
let evaluate = await eval(`;(async () => {${msg.StringMsg.replace('>','')} })()`).catch(e => { return e})
return client.reply(msg,util.format(evaluate))
} catch(e){
return client.reply(msg,util.format(e))
}
break
case /^[$]/i.test(msg.StringMsg):
if (!isOwner) return
exec(msg.StringMsg.replace(/^[$]/i,''),(stderr,stdout) => {
if (stderr) return client.reply(msg,util.format(stderr))
return client.reply(msg,util.format(stdout))
})
break
}

switch(command){
case '>':
if (!isOwner) return
try{
let evaluate = await eval(`;(async () => {${commandQ} })()`).catch(e => { return e})
return client.reply(msg,util.format(evaluate))
} catch(e){
return client.reply(msg,util.format(e))
}
break
case 'sticker':
case 'stiker':
if (!quotedM && isText) return client.reply(msg,`Kirim Foto Tag Atau Dengan Caption ${stringPref}sticker`)
let media = ["videoMessage","imageMessage","stickerMessage"]
if (media.includes(MsgType) || media.includes(quotedM.messageData.MsgType)){
if (MsgType == media[0] && !(message.videoMessage.seconds < 9) || quotedM && quotedM.messageData.MsgType == media[0] && !(quotedM.message.videoMessage.seconds < 9)) return client.reply(msg,'Maksimal Sticker Video 8 Detik:)')
let buffer = quotedM && !quotedM.messageData.isText ? (await quotedM.messageData.downloadM()).buffer : (await msg.messageData.downloadM()).buffer
if (commandQ && commandQ.includes('|')){
let teks = commandQ.split('|')
let exif = functions.createExif(teks[0],teks[1],`${Date.now()}`)
return client.sendSticker(from,buffer,{quoted:msg},`./tmp/${Date.now()}.exif`)
} else {
return client.sendSticker(from,buffer,{quoted:msg})
}
}
break
}

} catch (e) {
console.log('Error : \n'+e)
console.log(e)
client.sendMessage(`6281910263857@s.whatsapp.net`,util.format(e),'conversation')
}})}
starts()
