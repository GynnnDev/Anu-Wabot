const fetch = require('node-fetch')
const spin = require('spinnies')
const axios = require('axios')
const Crypto = require('crypto')

const wait = async (media) => new Promise(async (resolve, reject) => {
const attachmentData = `data:image/jpeg;base64,${media.toString('base64')}`
const response = await fetch("https://trace.moe/api/search",{method: "POST",body: JSON.stringify({ image: attachmentData }),headers: { "Content-Type": "application/json" }})
if (!response.ok) reject(`Gambar tidak ditemukan!`);
const result = await response.json()
try {
const { is_adult, title, title_chinese, title_romaji, title_english, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
let belief = () => similarity < 0.89 ? "❒「  *Music ID - BOT*  」 : " : ""
let ecch = () => is_adult ? "Iya" : "Tidak"
resolve({video: await getBuffer(`https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`), teks: `${belief()}
├ *Ecchi :* ${ecch()}
├ *Judul Jepang :* ${title}
├ *Ejaan Judul :* ${title_romaji}
├ *Judul Inggris :* ${title_english}
├ *Episode :* ${episode}
└ *Season  :* ${season}`});
	} catch (e) {
		console.log(e)
		reject(`Anime Yang Di Tuju Tidak Ditemukan`)
	}
})

const h2k = (number) => {
    var SI_POSTFIXES = ["", " K", " M", " G", " T", " P", " E"]
    var tier = Math.log10(Math.abs(number)) / 3 | 0
    if(tier == 0) return number
    var postfix = SI_POSTFIXES[tier]
    var scale = Math.pow(10, tier * 3)
    var scaled = number / scale
    var formatted = scaled.toFixed(1) + ''
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2)
    return formatted + postfix
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

const randomBytes = (length) => {
    return Crypto.randomBytes(length)
}

const generateMessageID = () => {
    return randomBytes(10).toString('hex').toUpperCase()
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const NumberRandom = (output) => {
	return `${Math.floor(Math.random() * 10000)}${output}`
}

const spinner = { 
  "interval": 120,
  "frames": [
"🕐",
"🕑",
"🕒",
"🕓",
"🕔",
"🕕",
"🕖",
"🕗",
"🕘",
"🕙",
"🕚",
"🕛"
    ]}

let globalSpinner;

const getGlobalSpinner = (disableSpins = false) => {
  if(!globalSpinner) globalSpinner = new spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins});
  return globalSpinner;
}

spins = getGlobalSpinner(false)

const start = (id, text) => {
	spins.add(id, {text: text})
	}
const info = (id, text) => {
	spins.update(id, {text: text})
}
const success = (id, text) => {
	spins.succeed(id, {text: text})
	}
const close = (id, text) => {
	spins.fail(id, {text: text})
}

module.exports = { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, NumberRandom, start, info, success, close, }
