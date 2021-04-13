const cheerio = require('cheerio')
const axios = require('axios')

const searchAndro1 = async(aplikasi) => {
const res = await axios.get(`https://an1.com/tags/MOD/?story=${aplikasi}&do=search&subaction=search`)
let hasil = []
const $ = cheerio.load(res.data)
$('div').find('.search-results > .inner').each(function(a, b) {
let judul =  $(b).find('.left > .title').find('a').text()
let link = $(b).find('.left > .title').find('a').attr('href')
let thumb = $(b).find('span > img').attr('src')
hasil.push({ judul, link, thumb })
}) 
return hasil
}
const downAndro1 = async (linkdown) => {
const base = `https://an1.com/`
const des = await axios.get(linkdown)
const sup = cheerio.load(des.data)
const k = sup('div').find('.white-box')
result = []
let judul = sup(k).find('div > h1').text() 

let thumb = sup(k).find('div > div > img').attr('src')

let dev = sup(k).find('div > .text.dev > span').text()

let andro = sup(k).find
('div > .text.android').text()

let versi = sup(k).find
('div > .text.version').text()

let genre = sup(k).find('div > .text.class').text() 

let updated = sup(k).find('.inner > .item > span > time').text() 

let size = sup('div.item:nth-child(2) > span:nth-child(2)').text()

let install = sup('div.item:nth-child(3) > span:nth-child(2)').text()

let rated = sup('div.item:nth-child(4) > span:nth-child(2)').text()

let link = base + sup(k).find('.get-product-holder > a').attr('href')

const bes = await axios.get(link)

let dl_link = sup('div').find('span').toString() 

result.push({ judul, thumb, dev, andro, versi, genre, updated, link, size, install, rated})

return result
}

module.exports = { searchAndro1, downAndro1}