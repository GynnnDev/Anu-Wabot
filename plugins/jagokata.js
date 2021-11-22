const axios = require('axios')
const cheerio = require('cheerio')

const jagoKata = async (query) => {
const base = `https://jagokata.com/kata-bijak/kata-${query}.html`
const des = await axios.get(base)
const sup = cheerio.load(des.data)
var page = sup('h4 > strong').eq(2).text() / 10
page = parseInt(page)
const randomPage = Math.floor(Math.random() * page)
const res = await axios.get(`${base}?page=${randomPage}`)
const $ = cheerio.load(res.data)
const hasil = []
const list = $('ul > li')
const random = Math.floor(Math.random() * 10)
const isi = $(list).find('q.fbquote').eq(random).text() 

var by = $(list).find('div > div > a').eq(random).text()
by = by ? by : "Kang Galon"
hasil.push({ isi,  by })
return hasil
}

module.exports = { jagoKata }