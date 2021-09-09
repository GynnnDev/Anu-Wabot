cmd.on('menu', ['menu'], ['ignore'], async (msg, {
    query,
    client,
    prefix,
    command
}) => {
    let {
        list
    } = botinfo.unicode
    let type = query.toLowerCase().trim()
    let lama = []
    if (!cmd._tags[type]) {
        let hasile = `*Hai ${msg.sender.name}!*\n\n*Command list*\n`
        for (let a in cmd._tags) {
            if (!a.includes("ignore")) {
                hasile += list + ` ${prefix[0]}${a.toLowerCase()}menu\n`

            }
        }
        hasile = hasile.trim()
        buttons = [{
            buttonId: 'id1',
            buttonText: {
                displayText: 'Syarat & ketentuan'
            },
            type: 1
        }, {
            buttonId: 'id2',
            buttonText: {
                displayText: 'Contact owner'
            },
            type: 1
        }, {
            buttonId: 'id3',
            buttonText: {
                displayText: 'tombol serah'
            },
            type: 1
        }]

        path = require('fs').readFileSync('./src/images/logo.jpg')
        buff = (await client.getBuffer(path)).buffer
        imageMessage = (await client.prepareMessage(msg.from, path, 'imageMessage', {
            thumbnail: buff
        })).message.imageMessage

        buttonsMessage = {
            contentText: hasile,
            footerText: 'Gunakan bot dengan baik dan bijak, lihat S&K sebelum menggunakan bot :>',
            imageMessage,
            buttons,
            headerType: 4
        }

        prep = await client.prepareMessageFromContent(msg.from, {
            buttonsMessage
        }, {
            contextInfo: {
                mentionedJid: [`${msg.sender.jid}`]
            }
        })

        return client.relayWAMessage(prep)
    }
})

cmd.on('menucmd', ['[a-z]{0,20}menu'], ['ignore'], async (msg, {
    prefix,
    client
}) => {
    let {
        list
    } = botinfo.unicode
    let type = msg.string.replace(prefix[0], '').split('menu')[0].toLowerCase()
    let lama = []
    if (type.includes("owner") && !msg.isOwner) return client.reply(msg, botinfo.response.owner)
    if (!cmd._tags[type]) return
    for (let a in cmd._tags[type]) {
        if (!cmd._tags[type][a].enable) continue
        let prek = cmd._tags[type][a].usedPrefix ? prefix[0] : ''
        lama = lama.concat(cmd._tags[type][a]._command.map(value => prek + value))
    }
    let hasil = `*${type[0].toUpperCase()+type.slice(1).toLowerCase()} Menu*\n`
    for (let b of lama) {
        hasil += list + ` ${b.replace(/\\/g,'').toLowerCase()}\n`
    }
    hasil = hasil.trim()
    buttons = [{
        buttonId: 'id4',
        buttonText: {
            displayText: 'Cara penggunaan'
        },
        type: 1
    }]

    buttonsMessage = {
        contentText: hasil,
        footerText: '',
        buttons,
        headerType: 1
    }

    prep = await client.prepareMessageFromContent(msg.from, {
        buttonsMessage
    }, {
        contextInfo: {
            mentionedJid: [`${msg.sender.jid}`]
        }
    })

    return client.relayWAMessage(prep)
})
