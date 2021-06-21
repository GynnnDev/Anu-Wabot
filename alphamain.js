//Call All Module
const fs = require('fs')
const moment = require('moment-timezone')
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
const delay = async (ms) => {
 return new Promise(resolve => setTimeout(resolve, ms * 1000))
}
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { 
  color,
  bgcolor
} = require('./lib/color')
const { 
  help
} = require('./src/help')
const {
  newsCnn
} = require('./plugins/cnn.js')
const { 
  wait, 
  getBuffer, 
  h2k, 
  generateMessageID,
  getGroupAdmins,
  NumberRandom,
  start,
  info,
  success,
  close,
} = require('./lib/functions')
const { 
  fetchJson
} = require('./lib/fetcher')
const { 
  jagoKata
} = require('./plugins/jagokata.js')
const {
  convertSticker
} = require("./plugins/swm.js")
const {
  webp2gifFile 
} = require("./plugins/gif.js")
const {
  mediafireDl
} = require('./plugins/mediafire.js')
const {
  dafontSearch, 
  dafontDown
} = require('./plugins/dafont.js')
const {
  covid
} = require('./plugins/covid.js')
const { 
  herolist 
} = require("./plugins/herolist.js")
const { 
  herodetails 
} = require("./plugins/herodetail.js")
const { 
  y2mateA,
  y2mateV
} = require('./plugins/y2mate.js')
const {
  fotoIg, 
  videoIg
} = require('./plugins/ig.js')
const {
  lirikLagu
} = require('./plugins/lirik.js')
const {
  fbDown 
} = require('./plugins/fb.js')
const {
  wikiSearch
} = require('./plugins/wiki.js')
const { 
  exec
} = require('child_process')
const { 
  recognize 
} = require('./lib/ocr')
const { 
  removeBackgroundFromImageFile
} = require('remove.bg')

//Json Place
var welwel = []
var nana = []
var tebak = []
const tttawal = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"]
const groupcommand = []
const makercommand = []
const downloadcommand = []
const searchcommand = []
const funcommand = []
var idttt = []
var players1 = []
var players2 = []
var gilir = []
var colors = ['red','white','black','blue','yellow','green']
var nit = []

//Metadata Place
prefix = `z`
multipref = false
mode = "public"
unikodhead = `❒`
unikodbody = `├ `
unikodend = `└`
unikodwing = ["「","」"]
unikodlist = `⦿`
botname = `Zbin-Wabot`
blocked = []

//Check Time Today You Can Change Timezone To Your Country, See https://www.npmjs.com/package/moment-timezone For Documentations
const time = moment.tz('Asia/Jakarta').format('HH:mm DD-MM-YYYY')

//Check Date Today
const date = moment.tz('Asia/Jakarta').format('DD-MM-YYYY') + '-2021'

//Check Clock Today
const clock = moment.tz('Asia/Jakarta').format('HH:mm') 

//The Brain Of All
async function starts() {
  
//Connect To Wa Web
const client = new WAConnection()
client.version = [2, 2119, 6]
client.browserDescription = ["Zbin-Bot", "Desktop", "3.0"]

console.log('>', '[',color('INFO','blue'),']','Starting Bot...')
console.log('>', '[',color('INFO','blue'),']','Configure Connection...')
console.log('>', '[',color('INFO','blue'),']','Configure Success, Connecting...')
client.logger.level = 'warn'

//Qr Place
client.on('qr', () => { 
console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
})

//If Already Scan A Qr
fs.existsSync('./session.json') &&
client.loadAuthInfo('./session.json')
	
//Action In Connect
client.on('connecting', () => { 
start('2', 'Connecting...')
})

//Action If Connected
client.on('open', () => {
success('2', 'Connected')
}) 

//Timeout Reconect If Disconnect
await client.connect({timeoutMs: 30*1000})
  

//Action After Connect The Session
fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

//When Chat Update
client.on('chat-update',async(msg) => {
  
//msg Is The Call Of New Message
try {

//When Client Not Listen New Chat Update
if (!msg.hasNewMessage) return

//New Message For Manipulation
msg = JSON.parse(JSON.stringify(msg)).messages[0]

//If Message Not Valid
if (!msg.message) return

//If Message From Whatsapp Story
if (msg.key && msg.key.remoteJid == 'status@broadcast') return

//Use To Prevent Looping Or Getting Hijacked
if (msg.key.id.startsWith('3EB0') && msg.key.id.length === 12) return 
	
//To Bypass Ephemeral Message
msg.message = (Object.keys(msg.message)[0] == 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message

//From Is Where Message New Chatted On
const from = msg.key.remoteJid

//To Check Type Of Message
const MsgType = Object.keys(msg.message)[0]

//To Check The Data Of Message
const MsgData = typeof msg.message[MsgType]== "object" ? Object.keys(msg.message[MsgType]).includes("contextInfo") ? Object.keys(msg.message[MsgType]) + Object.keys(msg.message[MsgType].contextInfo) : Object.keys(msg.message[MsgType]) : Object.keys(msg.message)

//Prepare Message Type More Brief
const typeMsg = MessageType

//To Get Text In Message New
const StringMsg = (MsgType === typeMsg.text) ? msg.message.conversation : (MsgData.includes('caption')) ? msg.message[MsgType].caption : (MsgData.includes('text')) ? msg.message[MsgType].text : undefined

//To Check The Message Are Quoted Some Message Or Not
const isQuotedMsg = MsgData.includes("contextInfo") && MsgData.includes("quotedMessage")

//To Check QuotedMessage Type
const quotedMsgType = isQuotedMsg ? Object.keys(msg.message[MsgType].contextInfo.quotedMessage)[0] : "Not Quoted Any Message"

//To Check Quoted Message MsgData
const quotedMsgData = isQuotedMsg ? typeof msg.message[MsgType].contextInfo.quotedMessage[quotedMsgType] == "object" ? Object.keys(msg.message[MsgType].contextInfo.quotedMessage[quotedMsgType]) : Object.keys(msg.message[MsgType].contextInfo.quotedMessage) : "Not Quoted Any Message"

//To Get Full Info About Quoted Message
const quotedMsg = isQuotedMsg ? await client.loadMessage(from, msg.message[MsgType].contextInfo.stanzaId) : "Not Quoted Any Message"

//To Get Quoted Message sender 
const quotedMsgSender = isQuotedMsg? quotedMsg.participant : "Not Quoted Any Message"

//To Get Quoted Message id
const quotedMsgId = isQuotedMsg? quotedMsg.key.id : "Not Quoted Any Message"

//To Check Quoted Message Are Media Or Not
const quotedMsgIsMedia = isQuotedMsg && ((quotedMsgType == typeMsg.video) || (quotedMsgType == typeMsg.image) || (quotedMsgType == typeMsg.audio) || (quotedMsgType == typeMsg.document) || (quotedMsgType == typeMsg.sticker))

//To Check Message Are Media Or Not
const isMedia = ((MsgType == typeMsg.video) || (MsgType == typeMsg.image) || (MsgType == typeMsg.audio) || (MsgType == typeMsg.document) || (MsgType == typeMsg.sticker))

//To Check The Message Are Only TextMessage Or Not
const isText = (MsgType == typeMsg.text) || (MsgType == typeMsg.extendedText && Object.keys(msg.message.extendedTextMessage).includes("text"))


//To Check Message Mention Any Jid Or not
const isMentioned = MsgData.includes("contextInfo") && MsgData.includes("mentionedJid")

//To Get MentionedJid
const mentionedJid = isMentioned ? msg.message[MsgType].contextInfo.mentionedJid : false

//To Get String Of The client Number
const clientNumber = client.user.jid

//To Check Is Group When Message Arrived
const isGroup = from.endsWith('@g.us')

//To Check The Sender Of Message
const sender = isGroup ? msg.participant ? msg.participant : clientNumber : msg.key.remoteJid

//Group Metadata
const groupMetadata = isGroup ? await client.groupMetadata(from) : false
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.jid : ''
const groupDesc = isGroup? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isClientGroupAdmins = groupAdmins.includes(clientNumber) || false
const isGroupAdmins = groupAdmins.includes(sender) || false

//Msg Manipulation For More Brief
msg.StringMsg = StringMsg
msg.messageData = {}
msg.messageData.from = from
msg.messageData.sender = sender
msg.messageData.MsgType = MsgType
msg.messageData.MsgData = MsgData
msg.messageData.isMentioned = isMentioned
msg.messageData.mentionedJid = mentionedJid
msg.messageData.isText = isText
msg.messageData.isMedia = isMedia
msg.messageData.isMentioned = isMentioned
msg.messageData.mentionedJid = mentionedJid
msg.messageData.isQuotedMsg = isQuotedMsg
msg.messageData.quotedMsgId = quotedMsgId
msg.messageData.quotedMsgSender = quotedMsgSender
msg.messageData.quotedMsgType = quotedMsgType
msg.messageData.quotedMsgIsMedia = quotedMsgIsMedia
msg.messageData.quotedMsgData = quotedMsgData
msg.messageData.quotedMsg = quotedMsg
msg.groupData = groupMetadata
msg.groupData.isClientGroupAdmins = isClientGroupAdmins
msg.groupData.admins = groupAdmins
//Check Case Of Covid19 In Indonesia Country, You Can Change On plugins/covid.js, See https://www.worldometers.info/coronavirus/country/ For Country Supported
var covid19 = await covid()

//Functions

function pad(s){

    return (s < 10 ? '0' : '') + s;

  }

/**
     * Exact count
     * @param {Number} Seconds
*/
function count(seconds){
if (typeof seconds !== "number") throw "clientError: Unexpected Param " + typeof seconds
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}


/**

     * Exact ManipulationMessage
     * @param {Object} mess
*/
"otewe"


/**
     * Exact reply
     * @param {String} Teks
*/
client.reply = async(teks) => {
if (typeof teks !== "string") throw "clientError: Unexpected Param " + typeof teks
return await client.sendMessage(from, teks, typeMsg.text, {quoted: msg})
}



/**
     * Exact sendFileFromStorage
     * @param {String} Jid(WAId)
     * @param {String} Path
     * @param {String} Type
     * @param {Object} Options
     * @param {String} toDoc(Filename)
*/
client.sendFileFromStorage = async(jid, path, type, options, toDoc) => {
try {
var buffer = fs.readFileSync(path)
var FileData = await FileType.fromBuffer(buffer)
if (toDoc) return await client.sendMessage(from, buffer, typeMsg.document, {quoted:msg, mimetype: FileData.mime, filename: toDoc + "." + FileData.ext, title: toDoc + FileData.ext})
return await client.sendMessage(from, buffer, type, options)
} catch(e) {
client.reply("*[ ! ]* Error Gagal Dalam Mengirim Media")
throw "clientError: " + e + ",Catching With Reply Message"
}
}

/**
     * Exact sendFileFromUrl
     * @param {String} Jid(WAId)
     * @param {String} Link Must Be Url
     * @param {String} Type
     * @param {Object} Options
     * @param {String} toDoc(Filename)
*/
client.sendFileFromUrl = async(jid, link, type, options, toDoc) => {
if (!isUrl(link)) throw "clientError: Unexpected String Is Not Url"
try {
var buffer = await getBuffer(link)
var FileData = await FileType.fromBuffer(buffer)
if (toDoc) return await client.sendMessage(jid, buffer, typeMsg.document, {quoted:msg, mimetype: FileData.mime, filename: toDoc + "." + FileData.ext, title: toDoc + FileData.ext})
return await client.sendMessage(jid, buffer, type, options)
} catch(e) {
client.reply("*[ ! ]* Error Gagal Mendownload Dan Mengirim Media")
throw "clientError: " + e + "\nCatching With Reply Message.... "
}
}

/**
     * Exact Return 
     * @param {Value} objectPromise
*/
Return = (objectPromise) => {
var objectString = JSON.stringify(objectPromise, null, 2)
var parse = util.format(objectString)
if (objectString == undefined){
parse = util.format(objectPromise)
}
return client.reply(parse)
}

/**
     * Download Media Who Is Quoted Or The Media Message It self
     * @param {String} save For The Filename Of Downloaded Media
*/
client.downloadM = async(save) => {
if (msg.messageData.isMedia || msg.messageData.quotedMsgIsMedia){
var MediaDownload = quotedMsgIsMedia ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message[MsgType].contextInfo : msg
var MediaMessage = quotedMsgIsMedia ? msg.message[MsgType].contextInfo.quotedMessage[quotedMsgType] : msg.message[MsgType]
var ext = Object.keys(MediaMessage).includes('title') ? MediaMessage.title.split('.') : MediaMessage.mimetype.includes('octet-stream') ? ["bin"] : MediaMessage.mimetype.split('/')
ext = ext[ext.length - 1]
var buffer = await client.downloadMediaMessage(MediaDownload)
var FileData = await FileType.fromBuffer(buffer) || {mime: MediaMessage.mimetype, ext: ext}
if(save){
var filename = `${save}.${FileData.ext}`
output = fs.writeFileSync(filename, buffer)
return {ext: FileData.ext, mime: FileData.mime, output: filename,buffer: buffer}
}
return {ext: FileData.ext, mime: FileData.mime, output: buffer}
} else {
throw "clientError: No Message Present,Make Sure Is Media Message"
}
}

/**
     * Exact Do Fake Reply
     * @param {String|Buffer} query
     * @param {String} fakeJid
     * @param {Object} Message
*/
client.fakeReply = async(query, type, options, remoteJid = from, fakeJid, Message) => {
var option = {
  quoted: { key: {fromMe: false, participant: `${fakeJid}@s.whatsapp.net`,remoteJid: remoteJid },
"message": Message}, 
... options
}
return await client.sendMessage(from, query, type, option)
}


/**
     * Exact send Message From Content
     * @param {String} Jid(WAId)
     * @param {Object} message
     * @param {Object} Options
*/

client.sendMessageFromContent = async(jid,message,options) => {
var option = {
contextInfo: {},
...options
}
var prepare = await client.prepareMessageFromContent(jid,message,option)
await client.relayWAMessage(prepare)
return prepare
}



//Body Is Call Of The Text In The Message
var body = StringMsg !== undefined ? StringMsg : "NotCmd"
var bodi = StringMsg !== undefined ? StringMsg : "MediaMessage"

//A Commans Pasif For Only Owner Or for Instan Response The msg 
var pasifCmd = bodi.includes(' ') ? bodi.trim().split(/ +/).shift().toLowerCase() : bodi.toLowerCase()
const pasifQ = bodi.replace(pasifCmd,'')


//Pref Is Prefix Of The Body To Command
//I Was Add Multi Prefixes
let pref;
if (multipref){
pref = new RegExp(`^[${prefix}]`)
body = pref.exec(body) ? body : ''
} else if (!multipref){
pref = `${prefix}`
body = body.startsWith(pref) ? body : ''
}

//The Command For Switch
const command = body.replace(pref, '').trim().split(/ +/).shift().toLowerCase()

//Args is The Array Of Message
const args = bodi.includes(' ') ? bodi.trim().split(/ +/).slice(1) : []

//StringPrefix Is The String Of Prefix
const StringPrefix = body.toLowerCase().includes(' ') ? body.toLowerCase().split(' ')[0].replace(`${command}`, '') : body.toLowerCase().replace(`${command}`, '')

//To Check The Body Is Command Or Not
const isCmd = multipref ? pref.exec(body) : body.startsWith(pref)

//To Get CmdQuery
const CmdQuery = isCmd ? body.replace(command, '').replace(StringPrefix, '') : false

//To Filter From Is Owner Number Or Not
const ownerNumber = [client.user.jid, "6281910263857@s.whatsapp.net","994407324213@s.whatsapp.net","6282331218665@s.whatsapp.net","6282145024224@s.whatsapp.net","6285807107404@s.whatsapp.net","62895343001883@s.whatsapp.net","6281216654518@s.whatsapp.net","6285856408596@s.whatsapp.net","62895331406727@s.whatsapp.net","6285746619545@s.whatsapp.net","62815150192842@s.whatsapp.net","6288291579481@s.whatsapp.net","6285761863240@s.whatsapp.net","6281913948958@s.whatsapp.net","628816344806@s.whatsapp.net","6283804593408@s.whatsapp.net", "62821865786756@s.whatsapp.net", "6289679070459@s.whatsapp.net", "6289677023595@s.whatsapp.net", "6289692514366@s.whatsapp.net"]

//Filter Is Owner Or Not
const isOwner = ownerNumber.includes(sender) ? true : msg.key.fromMe ? true : false

//Switch Mode For Bot
if (mode == "self" && !isOwner) return
if (mode == "maintenance" && body && !isOwner) return reply("Maaf Bot Dalam Keadaan Mode Maintenance")

//Url Regex Function
const isUrl = (url) => {
	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

switch(pasifCmd){
case ">":
if (!isOwner) return
try {
var stringEval = `;(async () => { ${pasifQ} })()`
var evaluate = eval(stringEval).catch((e) => {
var syntaxErr = syntax(stringEval)
var boldErr = util.format(e)
var fullErr = syntaxErr == undefined ? '' : `\n\n${syntaxErr}`.replace(";(async () => { ",'').replace(" })()",'').replace("(anonymous file)","Line Error")
return client.reply(`${boldErr}${fullErr}`)
})
return client.reply(util.format(evaluate))
} catch(e) {
syntaxErr = syntax(stringEval)
boldErr = util.format(e)
fullErr = syntaxErr == undefined ? '' : `\n\n${syntaxErr}`.replace(";(async () => { ",'').replace(" })()",'').replace("(anonymous file)","Line Error")
return client.reply(`${boldErr}${fullErr}`)
}
break
case "$":
if (!isOwner) return
exec(`${pasifQ}`, (err,stdout) => {
if (err) return client.reply(util.format(err))
return client.reply(util.format(stdout))
})
break
case "vilen":
var ucapan = ["Haii","Halo","Hmm","??","Hmm?","Ya?","Apa?","Hmmph?"]
return client.reply(ucapan[Math.floor(Math.random() * ucapan.length)])
break
}

} catch (e) {
console.log('Error : %s', color(e, 'red'))
console.log(e)
}
})
}
starts()
