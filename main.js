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

const fs = require('fs')
const moment = require('moment-timezone')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const util = require('util')
const axios = require('axios')
const cheerio = require('cheerio') 
const googleImage = require('g-i-s')
const yts = require('yt-search')
const ggs = require('google-it')

const antilenk = JSON.parse(fs.readFileSync('./src/antilink.json'))
const simin = JSON.parse(fs.readFileSync('./src/simi.json'))
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const chatban = JSON.parse(fs.readFileSync('./src/banchat.json'))
prefix = `z`
botname = 'Zbin-wabot'
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log('>', '[',color('INFO','blue'),']','Starting Bot...')
  console.log('>', '[',color('INFO','blue'),']','Configure Connection...')
  console.log('>', '[',color('INFO','blue'),']','Configure Success, Connecting...')
	client.on('qr', () => {
	console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')
	client.on('connecting', () => {
	start('2', 'Connecting...')
	})
	client.on('open', () => {
	success('2', 'Connected')
	}) 
	await client.connect({timeoutMs: 30*1000})
  fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	client.on('group-participants-update', async (anu) => {
	if (!welkom.includes(anu.jid)) return
	try {
	const mdata = await client.groupMetadata(anu.jid)
	console.log(anu)
	if (anu.action == 'add') {
	num = anu.participants[0]
	try {
	ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
	} catch {
	ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	}
	teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
	let buff = await getBuffer(ppimg)
	client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
	} else if (anu.action == 'remove') {
	num = anu.participants[0]
	try {
	ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
	} catch {
	ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	}
	teks = `Sayonara @${num.split('@')[0]}👋`
	let buff = await getBuffer(ppimg)
	client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
	}
	} catch (e) {
	console.log('Error : %s', color(e, 'red'))
	}
	})

	client.on('CB:Blocklist', json => {
  if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	}
	})

	client.on('chat-update', async (msg) => {
	try {
  if (!msg.hasNewMessage) return
  msg = JSON.parse(JSON.stringify(msg)).messages[0]
	if (!msg.message) return
	msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
	if (msg.key && msg.key.remoteJid == 'status@broadcast') return
	if (msg.key.fromMe) return
  global.prefix
	global.blocked
	global.botname
	const content = JSON.stringify(msg.message)
	const from = msg.key.remoteJid
	const type = Object.keys(msg.message)[0]
  const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
  const time = moment.tz('Asia/Jakarta').format('HH:mm DD-MM') + '-2021'
  const tanggal = moment.tz('Asia/Jakarta').format('DD-MM') + '-2021'
  const jams = moment.tz('Asia/Jakarta').format('HH:mm')
  const copid = await covid()
	body = (type === 'conversation' && msg.message.conversation.startsWith(prefix)) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption.startsWith(prefix) ? msg.message.imageMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption.startsWith(prefix) ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text.startsWith(prefix) ? msg.message.extendedTextMessage.text : ''
	bodi = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
  const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
  const args = body.trim().split(/ +/).slice(1)
  const isCmd = body.startsWith(prefix)
  const botNumber = client.user.jid
  const ownerNumber = ["6285230467582@s.whatsapp.net","62815150192843@s.whatsapp.net","6282331218665@s.whatsapp.net","6282145024224@s.whatsapp.net","6285807107404@s.whatsapp.net","62895343001883@s.whatsapp.net","6281216654518@s.whatsapp.net","6283128671683@s.whatsapp.net"]
  const arya = ["6289610916999@s.whatsapp.net"]
	const isGroup = from.endsWith('@g.us')
	const sender = isGroup ? msg.participant : msg.key.remoteJid
	const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
	const groupName = isGroup ? groupMetadata.subject : ''
	const groupId = isGroup ? groupMetadata.jid : ''
	const groupMembers = isGroup ? groupMetadata.participants : ''
	const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
	const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
	const isGroupAdmins = groupAdmins.includes(sender) || false
	const isWelkom = isGroup ? welkom.includes(from) : false
	const isNsfw = isGroup ? nsfw.includes(from) : false
	const isOwner = ownerNumber.includes(sender)
  const isBanChat = chatban.includes(from)
	if (isBanChat && !isOwner) return
	const aryanjing = arya.includes(sender)
	const isUrl = (url) => {
	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
	}
	
mess = {
wait: 'Tunggu Sedang Di Proses.......',
success: 'Berhasil ✓',
error: {
stick: 'Gagal, terjadi kesalahan saat mengkonversi',
Iv: 'Link Tidak Valid'
},
only: {
group: 'Perintah ini hanya bisa di gunakan dalam group!',
ownerG: 'Perintah ini hanya bisa di gunakan oleh owner group!',
admin: 'Hanya Admin Yang Bisa Menggunakan Command Ini',
Badmin: 'Bot Harus Admin Untuk Perintah Ini'
}
}
	
const reply = (teks) => {
	client.sendMessage(from, teks, text, {quoted: msg})
	}
const sendFileFromStorage = (path, type, options) => {
client.sendMessage(from, fs.readFileSync(path), type, options).catch(e => {
reply('_[ ! ] Error Gagal Dalam Mengirim Media_')
console.log(e)
})
}

const sendFile = async (medya, namefile, capti, tag, vn) => {
  baper = await getBuffer(medya)
  mimi = ''
  if (namefile.includes('m4a')){
  client.sendMessage(from, baper, audio,{mimetype: 'audio/mp4',quoted: tag, filename: namefile, ptt: vn})
  }
  if (namefile.includes('mp4')){
  client.sendMessage(from, baper, video, {mimetype: 'video/mp4', quoted: tag, caption: capti, filename: namefile})
  }
  if (namefile.includes('gif')){
  client.sendMessage(from, baper, video, {mimetype: Mimetype.gif, caption: capti, quoted: tag, filename: namefile})
  } 
  if (namefile.includes('png')){
  client.sendMessage(from, baper, image, {quoted: tag, caption: capti, filename: namefile})
  }
  
  if (namefile.includes('webp')){
  client.sendMessage(from, baper, sticker, {quoted: tag})
  } else {
  kobe = namefile.split(`.`)[1]
  client.sendMessage(from, baper, document, {mimetype: kobe, quoted: tag, filename: namefile})
  }
}

const sendFileFromUrl = async(link, type, options) => {
  hasil = await getBuffer(link)
	client.sendMessage(from, hasil, type, options).catch(e => {
	fetch(link).then((hasil) => {
	client.sendMessage(from, hasil, type, options).catch(e => {
	client.sendMessage(from, { url : link }, type, options).catch(e => {
	  reply('_[ ! ] Error Gagal Dalam Mendownload Dan Mengirim Media_')
	  console.log(e)
	})
	})
	})
	})
	}
const downloadM = async(save) => {
encmedia = isTagedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
encmedia = isTagedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
if (save) return await client.downloadAndSaveMediaMessage(encmedia)
return await client.downloadMediaMessage(encmedia)
  }
  const sendMess = (hehe, teks) => {
 client.sendMessage(hehe, teks, text)
 }
  const mentions = (teks, memberr, id) => {
	(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
	}
const fakeReply = (teks, target, teks2) => {
client.sendMessage(from, teks, text, {quoted: {key: {fromMe: false, participant: `${target}@s.whatsapp.net`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: teks2}}})
}

	colors = ['red','white','black','blue','yellow','green']
	const isMedia = (type === 'imageMessage' || type === 'videoMessage')
	const isAntiLink = isGroup ? antilenk.includes(from) : false
	const isSimi = simin.includes(from)
	const isTagedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
	const isTagedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
	const isTagedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
	const isTagedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
	const isTagedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
	
	
	if (aryanjing) return reply('kamu di bened')
	
	if (!isGroup && isCmd) console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
	
	if (!isGroup && !isCmd) console.log('\x1b[1;37m>', '[', '\x1b[1;31mRECV\x1b[1;37m', ']', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
	
  if (isCmd && isGroup) console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m',']', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
  
  if (!isCmd && isGroup) console.log('\x1b[1;37m>', '[', '\x1b[1;31mRECV\x1b[1;37m', ']', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
  
switch(command) {
case 'help':
case 'menu':
case 'bantuan':
reply(help(prefix, copid, tanggal, jams, botname))
break
case 'bugreport':
if (args.length < 1) return reply(`Ketik ${prefix}bugreport [fiturnya] [Error Nya Gimana]`) 
teks = args.join(' ')
reply('Terima Kasih Telah Melaporkan Bug Pada Owner, Jika Itu Sekedar Iseng Maka Akan Di Ban Oleh Bot!')
client.sendMessage('62815150192843@s.whatsapp.net',`*Bug Report:* ${teks}`, text)
break
case 'wiki':
if (args.length < 1) return reply(' Yang Mau Di Cari Apa? ')
teks = args.join(' ')
res = await wikiSearch(teks).catch(e => {
return reply('_[ ! ] Error Hasil Tidak Ditemukan_') 
}) 
result = `❒「  *Wiki*  」
├ *Judul :* ${res[0].judul}
└ *Wiki :* ${res[0].wiki}`
sendFileFromUrl(res[0].thumb, image, {quoted: msg, caption: result}).catch(e => {
  reply(result)
})
break
case 'antilink':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (args.length < 1) return reply('hmm')
if (Number(args[0]) === 1) {
if (isAntiLink) return reply('Mode Antilink sudah aktif')
antilenk.push(from)
fs.writeFileSync('./src/antilink.json', JSON.stringify(antilenk))
reply('Sukses mengaktifkan mode anti link di group ini')
} else if (Number(args[0]) === 0) {
antilenk.splice(from, 1)
fs.writeFileSync('./src/antilink.json', JSON.stringify(antilenk))
reply('Sukes menonaktifkan mode anti link di group ini')
} else {
reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
}
break
case 'banchat':
if (!isOwner) return 
if (args.length < 1) return reply('hmm')
if (body.endsWith('true')) {
if (isBanChat) return reply('Silent Mode Telah Aktif Sebelumnya')
chatban.push(from)
fs.writeFileSync('./src/banchat.json', JSON.stringify(chatban))
reply('*Silent Mode True....*')
} else if (body.endsWith('false')) {
chatban.splice(from)
fs.writeFileSync('./src/banchat.json', JSON.stringify(chatban))
reply('*Silent Mode False....*')
} else {
reply(`Ketik ${prefix}banchat true Untuk Mengaktifkan dan false untung Menonaktifkan`)
}
break
case 'modesimi':
if (args.length < 1) return reply('hmm')
if (Number(args[0]) === 1) {
if (isAntiLink) return reply('Mode Simi sudah aktif')
simin.push(from)
fs.writeFileSync('./src/simi.json', JSON.stringify(simin))
reply('Sukses mengaktifkan mode simi')
} else if (Number(args[0]) === 0) {
simin.splice(from, 1)
fs.writeFileSync('./src/simi.json', JSON.stringify(simin))
reply('Sukes menonaktifkan mode simi')
} else {
reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
}
break
case 'kodebahasa':
let LANGUAGES = `
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'ca': 'Catalan',
  'zh': 'Chinese',
  'zh-cn': 'Chinese (Mandarin/China)',
  'zh-tw': 'Chinese (Mandarin/Taiwan)',
  'zh-yue': 'Chinese (Cantonese)',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'en-au': 'English (Australia)',
  'en-uk': 'English (United Kingdom)',
  'en-us': 'English (United States)',
  'eo': 'Esperanto',
  'fi': 'Finnish',
  'fr': 'French',
  'de': 'German',
  'el': 'Greek',
  'ht': 'Haitian Creole',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'id': 'Indonesian',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'la': 'Latin',
  'lv': 'Latvian',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pt-br': 'Portuguese (Brazil)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'es': 'Spanish',
  'es-es': 'Spanish (Spain)',
  'es-us': 'Spanish (United States)',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'ta': 'Tamil',
  'th': 'Thai',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'cy': 'Welsh'`
reply(`${LANGUAGES}`)
break
case 'restart':
if (!isOwner) return
reply(mess.wait)
exec(`node main`)
reply('_Restarting Bot Success_')
break
case 'mediafire':
if (args.length < 1) return reply('Link Nya Mana? ')
if(!isUrl(args[0]) && !args[0].includes('mediafire')) return reply(mess.error.Iv)
reply(mess.wait)
teks = args.join(' ')
res = await mediafireDl(teks)
result = `❒「  *${botname}*  」
├ *Nama :* ${res[0].nama}
├ *Ukuran :* ${res[0].size}
└ *Link :* ${res[0].link}

_*Tunggu Proses Upload Media......*_`
reply(result)
sendFileFromUrl(res[0].link, document, {mimetype: res[0].mime, filename: res[0].nama, quoted: msg})
break
case 'dafontdown':
if (args.length < 1) return reply('Link Nya Mana? ')
if(!isUrl(args[0]) && !args[0].includes('dafont')) return reply(mess.error.Iv)
teks = args.join(' ')
res = await dafontDown(teks) 
result = `❒「  *${botname}*  」
├ *Judul :* ${res[0].judul}
├ *Style :* ${res[0].style}
├ *Nama File :* ${res[0].output}
└ *Isi File :* ${res[0].isi}`
reply(result)
sendFileFromUrl(res[0].down, document, {mimetype: 'font/ttf', filename: res[0].output, quoted: msg})
break
case 'dafontsearch':
case 'dafonts':
if (args.length < 1) return reply('Apa Yang Mau Di Cari? ')
teks = args.join(' ')
reply(mess.wait)
res = await dafontSearch(teks)
a = res[0]
result = `❒「  *${botname}*  」
├ *Judul :* ${a.judul}
├ *Style :* ${a.style}
└ *Link :* ${a.link}
`
reply(result)
break
case 'blocklist':
teks = 'This is list of blocked number :\n'
for (let block of blocked) {
teks += `~> @${block.split('@')[0]}\n`
}
teks += `Total : ${blocked.length}`
client.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": blocked}})
break
case 'pinterest':
case 'pin':
if (args.length < 1) return reply('Apa Yang Mau Dicari?')
reply(mess.wait)
teks = args.join(' ')
res = await axios.get(`https://api.fdci.se/rep.php?gambar=${teks}`)
var string = JSON.parse(JSON.stringify(res.data))
var random =  string[Math.floor(Math.random() * string.length)]
sendFileFromUrl(random, image, {quoted: msg, caption: `*Hasil Pencarian Dari :* ${teks}`})
break
case 'gimage':
case 'googleimage':
if (args.length < 1) return reply('Apa Yang Mau Dicari?')
reply(mess.wait)
teks = args.join(' ')
res = await googleImage(teks, google)
function google(error, result){
if (error){ return reply('_[ ! ] Error Terjari Kesalahan Atau Hasil Tidak Ditemukan_')}
else {
var gugIm = result
var random =  gugIm[Math.floor(Math.random() * gugIm.length)].url
sendFileFromUrl(random, image, {quoted: msg, caption: `*Hasil Pencarian Dari :* ${teks}`})
}
}
break
case 'google':
case 'googlesearch':
case 'ggs':
if (args.length < 1) return reply('Yang mau di cari apaan?')
teks = args.join(' ')
reply(mess.wait)
res = await ggs({'query' : `${teks}`})
kant = ``
for (let i of res) {
kant += `❒「  *Google*  」
├ *Judul :* ${i.title}
├ *Link :* ${i.link}
└ *Keterangan :* ${i.snippet}


`
}
var akhir = kant.trim()
reply(akhir)
break
break
case 'ocr':
if ((isMedia && !msg.message.videoMessage || isTagedImage) && args.length == 0) {
const encmedia = isTagedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
const media = await client.downloadAndSaveMediaMessage(encmedia)
reply(mess.wait)
await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3}).then(teks => {
reply(teks.trim())
fs.unlinkSync(media)
}).catch(err => {
reply(err.message)
fs.unlinkSync(media)
})
} else {
reply('Tag Foto Yang Mau Dijadikan Text!')
}
break
case 's':
case 'stiker':
case 'sticker':
reply(mess.wait)
if ((isMedia && !msg.message.videoMessage || isTagedImage) && args.length == 0) {
const encmedia = isTagedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
const media = await client.downloadAndSaveMediaMessage(encmedia)
ran = NumberRandom('.webp')
await ffmpeg(`./${media}`).input(media).on('error', function (err) {
fs.unlinkSync(media)
reply(mess.error.stick)
}).on('end', function () {
client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: msg})
fs.unlinkSync(media)
fs.unlinkSync(ran)
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(ran)
} else if ((isMedia && msg.message.videoMessage.seconds < 11 || isTagedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
const encmedia = isTagedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
const media = await client.downloadAndSaveMediaMessage(encmedia)
	ran = NumberRandom('.webp')
	await ffmpeg(`./${media}`).inputFormat(media.split('.')[1]).on('error', function (err) {
fs.unlinkSync(media)
tipe = media.endsWith('.mp4') ? 'video' : 'gif'
reply(`Gagal, pada saat mengkonversi ${tipe} ke stiker`)
	}).on('end', function () {
client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: msg})
fs.unlinkSync(media)
fs.unlinkSync(ran)
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(ran)
	} else if ((isMedia || isTagedImage) && args[0] == 'nobg') {
const media = await downloadM()
ranw = NumberRandom('.webp')
ranp = NumberRandom('.png')
reply(mess.wait)
keyrmbg = 'Your-ApiKey'
await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
fs.unlinkSync(media)
let buffer = Buffer.from(res.base64img, 'base64')
fs.writeFileSync(ranp, buffer, (err) => {
if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
})
exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
fs.unlinkSync(ranp)
if (err) return reply(mess.error.stick)
client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: msg})
})
})
} else {
reply(`Kirim Media dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim!`)
}
break
case 'tts':
if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: msg})
reply(mess.wait)
bogay = body.replace(prefix, '')
const gtts = require('./lib/gtts')(args[0])
if (args.length < 2) return client.sendMessage(from, 'Textnya mana om', text, {quoted: msg})
dtt = bogay.slice(8)
ranm = NumberRandom('.mp3')
dtt.length > 600 ? reply('Textnya kebanyakan om') : gtts.save(ranm, dtt, function() {
sendFileFromStorage(ranm, audio, {quoted: msg, mimetype: 'audio/mp4', ptt: true})
fs.unlinkSync(ranm)
})
break
case 'setprefix':
if (!isOwner) return
teks = args.join('') 
prefix = teks
reply(`_Change Prefix Success!! Prefix_ : *${prefix}*`)
break
case 'hidetag':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return client.eply(mess.only.admin)
teks = args.join(' ')
group = await client.groupMetadata(from);
member = group['participants']
jids = []
member.map( async adm => {
jids.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
client.sendMessage(from, teks, text, {contexInfo: {mentionedJid: jids}, quoted: msg})
break
case 'sticktag':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isTagedSticker) return reply('Tag Sticker Nya Oum')
teks = body.slice(9)
stik = await downloadM()
group = await client.groupMetadata(from);
member = group['participants']
jids = []
member.map( async adm => {
jids.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
client.sendMessage(from, stik, sticker, {contexInfo: {mentionedJid: jids}, quoted: msg})
break
case 'facebook':
case 'fb':
if (args.length < 1) return reply('Link Nya Mana? ')
if(!isUrl(args[0]) && !args[0].includes('facebook')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await fbDown(teks).catch(e => {
  reply('_[ ! ] Error Terjadi Kesalahan Dalam Memasuki Web Atau Link Error_')
})
a = res[0]
result = `❒「  *${botname}*  」
├ *Judul :* ${a.judul}
├ *Source :* ${a.source}
├ *Ukuran :* ${a.size}
├ *Kualitas :* ${a.quality}
├ *Type :* ${a.type}
└ *Nama File :* ${a.judul}.${a.type}
`
sendFileFromUrl(a.thumb, image, {caption: result, quoted: msg})
sendFileFromUrl(a.link, video, { mimetype: 'video/mp4',quoted: msg, filename: `${a.judul}.${a.type}`})
break
case 'ytmp3':
if (args.length < 1) return reply('Link Nya Mana?')
if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await y2mateA(teks).catch(e => {
reply('_[ ! ] Error Gagal Dalam Memasuki Web Y2mate_')
})
result = `❒「  *${botname}*  」
├ *Judul :* ${res[0].judul}
├ *Ukuran :* ${res[0].size}
├ *Kualitas :* ${res[0].quality}kbps
├ *Nama File :* ${res[0].output}
└ *Output :* ${res[0].tipe}

_*Tunggu Proses Uploading.....*_
`
sendFileFromUrl(res[0].thumb, image, {caption: result, quoted: msg}).then((lalu) => {
sendFileFromUrl(res[0].link, document, {quoted: msg, mimetype: 'audio/mp3', filename: res[0].output})
})
break
case 'ytmp4':
if (args.length < 1) return reply('Link Nya Mana?')
if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await y2mateV(teks).catch(e => {
reply('_[ ! ] Error Gagal Memasuki Web Y2mate_')
})
result = `❒「  *${botname}*  」
├ *Judul :* ${res[0].judul}
├ *Ukuran :* ${res[0].size}
├ *Kualitas :* ${res[0].quality}p
├ *Nama File :* ${res[0].output}
└ *Output :* ${res[0].tipe}

_*Tunggu Proses Uploading.....*_
`
sendFileFromUrl(res[0].thumb, image, {caption: result, quoted: msg}).then((lalu) => {
sendFileFromUrl(res[0].link, video, {quoted: msg, mimetype: 'video/mp4', filename: res[0].output})
})
break
case 'ig':
case 'instagram':
if (args.length < 1) return reply('Link Yang Mana? ')
if(!isUrl(args[0]) && !args[0].includes('instagram')) return reply(mess.error.Iv)
teks = args.join(' ')
if (!teks.endsWith('-video') && !teks.endsWith('-foto')) return reply('Ketik -foto / -video Untuk Mengisi Option ')
reply(mess.wait)
if (teks.endsWith('-foto')) {
igl = teks.replace('-foto',"") 
res = await fotoIg(igl).catch(e => {
  reply('_[ ! ] Error Gagal Dalam Masuk Web Atau Link Error_')
})
sendFileFromUrl(res[0].foto, image, {quoted: msg})
}
if (teks.endsWith('-video')) {
igl = teks.replace('-video',"")
res = await videoIg(teks).catch(e => {
  reply('_[ ! ] Error Gagal Dalam Masuk Web Atau Link Error')
})
sendFileFromUrl(res[0].video, video, {mimetype: 'video/mp4', quoted: msg})
}
break
case 'play':
if (args.length < 1) return reply('Apa Yang Mau Dicari?')
teks = args.join(' ')
reply(mess.wait)
if (!teks.endsWith("-doc")){
res = await yts(`${teks}`).catch(e => {
reply('_[ ! ] Error Query Yang Anda Masukan Tidak Ada_')
})
reply(`.•♫•♬• Playing ${res.all[0].title} •♬•♫•.`)
let thumbInfo = `❒「  *Youtube Search*  」
├ *Judul :* ${res.all[0].title}
├ *ID Video :* ${res.all[0].videoId}
├ *Diupload Pada :* ${res.all[0].ago}
├ *Views :* ${res.all[0].views}
├ *Durasi :* ${res.all[0].timestamp}
├ *Channel :* ${res.all[0].author.name}
└ *Link Channel :* ${res.all[0].author.url}

*_Tunggu Proses Upload....._*
`
sendFileFromUrl(res.all[0].image, image, {quoted: msg, caption: thumbInfo})
res = await y2mateA(res.all[0].url).catch(e => {
reply('_[ ! ] Error Saat Memasuki Web Y2mate_')
})
sendFileFromUrl(res[0].link, audio, {quoted: msg, mimetype: 'audio/mp4', filename: res[0].output})
}
if (teks.endsWith("-doc")){
const tec = teks.split("-doc")
res = await yts(`${tec}`).catch(e => {
reply('_[ ! ] Error Query Yang Anda Masukan Tidak Ada_')
})
reply(`.•♫•♬• Playing ${res.all[0].title} •♬•♫•.`)
let thumbInfo = `❒「  *${botname}*  」
├ *Judul :* ${res.all[0].title}
├ *ID Video :* ${res.all[0].videoId}
├ *Diupload Pada :* ${res.all[0].ago}
├ *Views :* ${res.all[0].views}
├ *Durasi :* ${res.all[0].timestamp}
├ *Channel :* ${res.all[0].author.name}
└ *Link Channel :* ${res.all[0].author.url}

*_Tunggu Proses Upload....._*
`
sendFileFromUrl(res.all[0].image, image, {quoted: msg, caption: thumbInfo})
res = await y2mateA(res.all[0].url).catch(e => {
reply('_[ ! ] Error Saat Memasuki Web Y2mate_')
})
sendFileFromUrl(res[0].link, document, {quoted: msg, mimetype: 'audio/mp3', filename: res[0].output})
}
break
case 'jagokata':
case 'quote':
case 'quotes':
case 'katamutiara':
if (args.length < 1) return reply('Yang mau di cari apaan?')
teks = args.join(' ')
res = await jagoKata(teks)
let hasil = `*“* ${res[0].isi} *”*
_~${res[0].by}_`
reply(hasil)
break
case 'yts':
case 'ytsearch':
if (args.length < 1) return reply('Yang mau di cari apaan?')
teks = args.join(' ')
reply(mess.wait)
res = await yts(`${teks}`)
kant = ``
for (let i of res.all) {
kant += `❒「  *${botname}*  」
├ *Judul :* ${i.title}
├ *ID Video :* ${i.videoId}
├ *Views :* ${i.views}
├ *Di Upload Pada : ${i.ago}
├ *Durasi :* ${i.timestamp}
├ *Channel :* ${i.author.name}
├ *Link Channel :* ${i.author.url}
└ *Link Video :* ${i.url}


`
}
var akhir = kant.trim()
sendFileFromUrl(res.all[0].image, image, {quoted: msg, caption: akhir})
break
case 'nulis':
case 'tulis':
if (args.length < 1) return reply('Yang mau di tulis apaan?')
teks = args.join(' ')
reply(mess.wait)
nulis = encodeURIComponent(teks)
res = await axios.get(`https://dt-04.herokuapp.com/nulis?text=${nulis}`)
if (res.data.error) return reply(res.data.error)
buff = Buffer.from(res.data.result.split(',')[1], 'base64')
client.sendMessage(from, buff, image, {quoted: msg, caption: mess.success}).catch(e => {
  return reply('_[ ! ] Error Gagal Dalam Mendownload Dan Mengirim File_')
})
break
case 'tagall':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
members_id = []
teks = (args.length > 1) ? body.slice(8).trim() : ''
teks += '\n\n'
for (let mem of groupMembers) {
teks += `*#* @${mem.jid.split('@')[0]}\n`
members_id.push(mem.jid)
}
mentions(teks, members_id, true)
break
case 'setname':
if (!isGroup) return reply(mess.only.group)
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (args.length < 1) return reply(`Ketik *${prefix}setname Isi* Buat Edit Subjek Grup`)
teks = args.join(' ')
client.groupUpdateSubject(from, teks)
break
case 'setpp':
if (!isGroup) return reply(mess.only.group)
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if ((isMedia && !msg.message.videoMessage || isTagedImage) && args.length == 0) {
encmedia = isTagedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
media = await client.downloadAndSaveMediaMessage(encmedia)
reply(mess.wait)
client.updateProfilePicture (from, media)
} else {
  reply(`Tag Foto Atau Kirim Foto Caption *${prefix}setpp*`)
}
break
case 'group':
case 'grup':
case 'gc':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (args.length < 1) return reply(`Ketik *${prefix}grup buka* Untuk Buka Grup dan *${prefix}grup tutup* Untuk Tutup Grup`)
if (body.endsWith('buka')){
  client.groupSettingChange (from, GroupSettingChange.messageSend, false)
}
if (body.endsWith('Buka')){
  client.groupSettingChange (from, GroupSettingChange.messageSend, false)
}
if (body.endsWith('tutup')){
  client.groupSettingChange (from, GroupSettingChange.messageSend, true)
}
if (body.endsWith('Tutup')){
  client.groupSettingChange (from, GroupSettingChange.messageSend, true)
}
break
case 'setdesc':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (args.length < 1) return reply(`Ketik *${prefix}setdesc Isi* Buat Edit Desc Grup`)
teks = body.slice(9)
client.groupUpdateDescription(from, teks)
break
case 'tagall2':
members_id = []
teks = (args.length > 1) ? body.slice(8).trim() : ''
teks += '\n\n'
for (let mem of groupMembers) {
teks += `╠➥ @${mem.jid.split('@')[0]}\n`
members_id.push(mem.jid)
}
reply(teks)
break
case 'tagall3':
members_id = []
teks = (args.length > 1) ? body.slice(8).trim() : ''
teks += '\n\n'
for (let mem of groupMembers) {
teks += `╠➥ https://wa.me/${mem.jid.split('@')[0]}\n`
members_id.push(mem.jid)
					}
client.sendMessage(from, teks, text, {detectLinks: false, quoted: msg})
break
case 'clearall':
if (!isOwner) return 
anu = await client.chats.all()
client.setMaxListeners(25)
for (let _ of anu) {
client.deleteChat(_.jid)
}
reply('Sukses delete all chat :)')
break
case 'bc':
if (!isOwner) return
if (args.length < 1) return
anu = await client.chats.all()
if (isMedia && !msg.message.videoMessage || isTagedImage) {
buff = await downloadM()
for (let _ of anu) {
client.sendMessage(_.jid, buff, image, {caption: `${body.slice(4)}

*_• Broadcast •_*`})
}
reply('Beres Lord Kirim Bc')
} else {
for (let _ of anu) {
sendMess(_.jid, `${body.slice(4)}

*_• Broadcast •_*`)
}
reply('Beres Lord Kirim Bc')
}
break
case 'meadmin':
if (!isGroup) return reply(mess.only.group)
if (!isOwner) return
if (isGroupAdmins) return reply('Lu Dah Admin Om')
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
client.groupMakeAdmin(from, [sender])
reply('Sukses')
break
case 'promote':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return
mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
if (mentioned.length > 1) {
teks = 'Berhasil Promote\n'
for (let _ of mentioned) {
teks += `@${_.split('@')[0]}\n`
}
mentions(from, mentioned, true)
client.groupRemove(from, mentioned)
} else {
mentions(`Berhasil Promote @${mentioned[0].split('@')[0]} Sebagai Admin Group!`, mentioned, true)
client.groupMakeAdmin(from, mentioned)
}
break
case 'demote':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return
mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
if (mentioned.length > 1) {
teks = 'Berhasil Demote\n'
for (let _ of mentioned) {
teks += `@${_.split('@')[0]}\n`
}
mentions(teks, mentioned, true)
client.groupRemove(from, mentioned)
} else {
mentions(`Berhasil Demote @${mentioned[0].split('@')[0]} Menjadi Member Group!`, mentioned, true)
client.groupDemoteAdmin(from, mentioned)
}
break
case 'add':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (args.length < 1) return reply('Yang mau di add jin ya?')
if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
try {
num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
client.groupAdd(from, [num])
} catch (e) {
console.log('Error :', e)
reply('Gagal menambahkan target, mungkin karena di private')
}
break
case 'kick':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
if (mentioned.length > 1) {
teks = '*Mengeluarkan :* '
for (let _ of mentioned) {
teks += `@${_.split('@')[0]}\n`
}
mentions(teks, mentioned, true)
client.groupRemove(from, mentioned)
					} else {
mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
client.groupRemove(from, mentioned)
}
break
case 'listadmin':
if (!isGroup) return reply(mess.only.group)
teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
no = 0
for (let admon of groupAdmins) {
no += 1
teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
}
mentions(teks, groupAdmins, true)
break
case 'linkgroup':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
linkgc = await client.groupInviteCode(from)
reply('https://chat.whatsapp.com/'+linkgc)
break
case 'leave':
if (!isGroup) return reply(mess.only.group)
if (isGroupAdmins || isOwner) {
client.groupLeave(from)
 } else {
 reply(mess.only.admin)
 }
 break
 case 'joox':
 if (args.length < 1) return reply('Lagu Yang Dicari Nya Apa? ')
 teks = args.join(' ')
 axios.get(`https://tobz-api.herokuapp.com/api/joox?q=${teks}&apikey=BotWeA`).then((res) => {
 if (res.data.error) return reply(res.data.error) 
 if (!res.data.error) reply(`Ditemukan!!`) 
 let hasil = `*Judul:* ${res.data.result.judul} - ${res.data.result.album}
*Album:* ${res.data.result.album}
*Artis:* ${res.data.result.judul}
*Di Upload Pada:* ${res.data.result.dipublikasi}

*_Tunggu Proses Upload......._*`
client.sendMessage(from, { url : res.data.result.thumb }, image, {quoted: msg, caption: hasil})
client.sendMessage(from, { url : res.data.result.mp3 }, document, {mimetype: 'audio/mp3', filename: `${res.data.result.judul} - ${res.data.result.album}.mp3`,quoted: msg})
})
break
case 'tomp3':
case 'toaudio':
if ((isMedia && !msg.message.videoMessage || isTagedVideo)&& args.length == 0) {
reply(mess.wait)
const encmedia = isTagedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
const media = await client.downloadAndSaveMediaMessage(encmedia)
const ran = NumberRandom('.mp3')
exec(`ffmpeg -i ${media} -b:a 192K -vn ${ran}`, (err) => {
if (err) return reply('_[ ! ] Error Terjadi Kesalahan Dalam Mengconvert_')
sendFileFromStorage(ran, audio, {mimetype: 'audio/mp4', quoted: msg, filename: ran})
fs.unlinkSync(ran)
fs.unlinkSync(media)
})
} else {
  reply(`_Tag Video Atau Kirim Video Dengan Caption ${prefix}tomp3 Untuk Convert Ke Mp3_`)
}
break
case 'toimg':
case 'toimage':
if (!isTagedSticker) return reply('Tag Stiker Yang Akan Di Jadikan Foto')
reply(mess.wait)
const media = await downloadM('save')
ran = NumberRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) return reply('*_• Gagal •_*')
sendFileFromStorage(ran, image, {caption : mess.success, quoted: msg})
fs.unlinkSync(ran)
})
break
case 'ytdesc':
if (args.length < 1) return reply('Video/Link Yt Nya Mana? ')
teks = args.join(' ')
res = await yts(teks)
reply(res.all[0].description)
break
case 'tovn':
if (!isTagedAudio) return reply('Tag Audio Yang Mau Di Jadiin Vn')
reply(mess.wait)
aud = await downloadM()
client.sendMessage(from, aud, audio, {mimetype: 'audio/mp4',ptt : true})
break
case 'preview':
if (body.endsWith("-font")) {
if (args.length < 1) return reply('Teks Sama Ukuran Nya Mana? ')
if (!body.includes("|")) return reply(`Ketik *${prefix}preview Teks|Ukuran|Font -font`)
mentah = args.join(' ').replace("-font", "")
teks = mentah.split('|')
if (isNaN(parseInt(teks[1]))) return reply("Pake Angka Gan")
reply(mess.wait)
size = teks[1]
isi = teks[0]
res = await dafontSearch(teks[2])
a = res[0]
result = `❒「  *${botname}*  」
├ *Judul :* ${a.judul}
├ *Style :* ${a.style}
└ *Link :* ${a.link}
`
reply(result)
res = await dafontDown(a.link) 
bup = await getBuffer(res[0].down)
const hasil = await fs.writeFileSync(res[0].output, bup)
exec(`unzip ${res[0].output}`, (err) => {
if (err) return
fs.unlinkSync(res[0].output)
font = `./${res[0].isi[0]}.ttf`
exec(`magick 'blank.png' -gravity center -fill '#ffff' -font '${font}' -size 1280x710 -pointsize ${size} -interline-spacing 7.5 -annotate 0 '${isi}' 'quotes.jpg'`, (err) => {
if (err) return reply('err') 
sendFileFromStorage('quotes.jpg', image,{quoted: msg})
fs.unlinkSync('quotes.jpg')
fs.unlinkSync(font)
})
})
return
}
if(!isTagedDocument) return reply('Tag font Yang Akan Di Jadikan Foto')
if (args.length < 1) return reply('Teks Sama Ukuran Nya Mana? ')
if (!body.includes("|")) return reply(`Ketik *${prefix}preview Teks|Ukuran* Sambil Tag Font`)
mentah = args.join(' ')
teks = mentah.split('|')
if (isNaN(parseInt(teks[1]))) return reply("Pake Angka Gan")
reply(mess.wait)
font = await downloadM('save')
size = teks[1]
isi = teks[0]
exec(`magick 'blank.png' -gravity center -fill '#ffff' -font '${font}' -size 1280x710 -pointsize ${size} -interline-spacing 7.5 -annotate 0 '${isi}' 'quotes.jpg'`, (err) => {
if (err) return reply('err') 
sendFileFromStorage('quotes.jpg', image,{quoted: msg})
fs.unlinkSync('quotes.jpg')
fs.unlinkSync(font)
})
break
case 'welcome':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (args.length < 1) return reply('Hmmmm')
if (Number(args[0]) === 1) {
if (isWelkom) return reply('Udah aktif um')
welkom.push(from)
fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
reply('Sukses mengaktifkan fitur welcome di group ini ✓')
} else if (Number(args[0]) === 0) {
welkom.splice(from, 1)
fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
reply('Sukses menonaktifkan fitur welcome di group ini ✔')
} else {
reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
}
break
case 'lirik':
if (args.length < 1) return reply("Apa Yang Mau Di Cari? ")
reply(mess.wait)
teks = body.slice(7)
lirikLagu(teks).then((res) => {
let lirik = `❒「  *${botname}*  」
└ *Lirik Lagu :*


${res[0].result}
`
reply(lirik)
})
break
case '>':
if (!isOwner) return
var konsol = args.join(' ')
function _return(sul) {
var sat = JSON.stringify(sul, null, 2)
var bang = util.format(sat)
return reply(bang)
}
try {
reply(util.format(eval(`;(async () => { ${konsol} })()`)))
console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', time, color(">", "green"), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
} catch (e) {
  err = String(e)
  reply(err)
}
break
case '$':
if (!isOwner) return 
const cod = args.join(' ')
exec(cod, (err, stdout) => {
if(err) return reply(`${err}`)
if (stdout) {
reply(`${stdout}`)
}
})
break
case 'shutdown':
if (!isOwner) return reply(mess.only.ownerB)
reply('Shutdown Bot In 3 Second....') 
setTimeout( () => {
client.close() }, 3000)
break
case 'wait':
if ((isMedia && !msg.message.videoMessage || isTagedImage) && args.length == 0) {
reply(mess.wait)
bang = isTagedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
foto = await client.downloadMediaMessage(bang)
await wait(foto).then(res => {
client.sendMessage(from, res.video, video, {quoted: msg, caption: res.teks.trim()})
}).catch(err => {
reply(err)
})
} else {
reply(`Kirim Foto Dengan Caption *${prefix}wait* Untuk Mencari Anime Dari Foto`)
}
break
default:
if (isSimi && bodi != undefined){
 res = await axios.get(`https://st4rz.herokuapp.com/api/simsimi?kata=${bodi}`)
 reply(res.data.result)
}
if (bodi.startsWith('$')){
if (!isOwner) return 
var konsol = bodi.slice(1)
exec(konsol, (err, stdout) => {
if(err) return reply(`${err}`)
if (stdout) {
reply(`${stdout}`)
}
})
} 
if (bodi.startsWith('>')){
if (!isOwner) return
var konsol = bodi.slice(1)
function _return(sul) {
var sat = JSON.stringify(sul, null, 2)
var bang = util.format(sat)
return reply(bang)
}
try {
reply(util.format(eval(`;(async () => { ${konsol} })()`)))
console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', time, color(">", "green"), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
} catch (e) {
  err = String(e)
  reply(err)
}
} else {
if (bodi != undefined) {
console.log('>', '[',color('INFO','red'),']',`Message : ${bodi} From`, color(sender.split('@')[0]))
}
if (isGroup && isAntiLink && isUrl(bodi) && !isGroupAdmins && bodi != undefined) {
var sial = sender.split('@')[0] + "@s.whatsapp.net"
client.groupRemove(from, [sial])
} 
}
if (!bodi.startsWith('$')) return
if (!bodi.startsWith('>')) return
}
} catch (e) {
const emror = String(e)
if (emror.includes('startsWith')){ 
return
}
if (emror.includes('this.isZero')){
return
}
console.log('Error : %s', color(e, 'red'))
console.log(e)
}
})
}
starts()
