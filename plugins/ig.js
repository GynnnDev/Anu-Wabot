const cheerio = require('cheerio')
const fetch = require('node-fetch')

const fotoIg = async (igLink) => {
function post(url, formdata) {
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
 'X-Requested-With': "XMLHttpRequest",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(Object.entries(formdata))
    })
}
const hasil = []
const res = await post('https://igdownloader.com/ajax', {
link: igLink, 
downloader: 'photo'
})
const mela = await res.json()
const $ = cheerio.load(mela.html)
let foto = $('div').find('.img-block > div > div.post > img').attr('src')
hasil.push({ foto })
return hasil
}

const videoIg = async (igLink) => {
function post(url, formdata) {
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
 'X-Requested-With': "XMLHttpRequest",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(Object.entries(formdata))
    })
}
hasil = []
res = await post('https://igdownloader.com/ajax', {
link: igLink, 
downloader: 'video'
})
mela = await res.json()
$ = cheerio.load(mela.html)
let video = $('div').find('.img-block > div > div.post').attr('data-src')
hasil.push({ video})
return hasil
}

module.exports = { fotoIg, videoIg}