cmd.on('menu-all', ['menu'], [], async (msg, {
    query,
    client,
    prefix,
    command,
    usedPrefix
}) => {
    let {
    list,
    down,
    upper,
    head
    } = botinfo.unicode
    let type = query.toLowerCase().trim()
    let lama = []
    let hasile = `*Hai _${msg.sender.name}_!*\n\n*Command list*\n`
    for (let a in cmd._tags) {
    hasile += list + ` ${prefix[0]}${a.toLowerCase()}menu\n`
     }
    hasile = hasile.trim()
    buttons = [{
    buttonId: usedPrefix+`snkbot`,
    buttonText: {
    displayText: 'Syarat & ketentuan'
    },
    type: 1
    },{
    buttonId: usedPrefix+'owner',
    buttonText: {
    displayText: 'Contact owner'
    },
    type: 1
    }]
    let buttonsMessage = {
            contentText: hasile,
            footerText: 'Gunakan bot dengan baik dan bijak, Dikira Gampang Ngentot',
            imageMessage:logo.message,
            buttons,
            headerType: 4
    }
return client.sendMessageFromContent(msg.from,{buttonsMessage})
    }
)

cmd.on('menu-cmd', [/^([a-z]{0,20}menu)/i], [], async (msg, {
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
    lama = lama.concat(cmd._tags[type][a].command.map(value => prek + value))
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
   let buttonsMessage = {
        contentText: hasil,
        footerText: `Made With Peju By Zbin`,
        buttons,
        headerType: 1
    }
return client.sendMessageFromContent(msg.from,{buttonsMessage})
})
