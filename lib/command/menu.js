cmd.on('dashboard', ['dashboard'], ['info'], async (msg, {
  query,
  client,
  prefix,
  command,
  usedPref
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
    hasile += list + ` ${usedPref}${a.toLowerCase()}menu\n`
  }
  hasile = hasile.trim()
  buttons = [{
    buttonId: usedPref+`snkbot`,
    buttonText: {
      displayText: 'Syarat & ketentuan'
    },
    type: 1
  },
    {
      buttonId: usedPref+'owner',
      buttonText: {
        displayText: 'Contact owner'
      },
      type: 1
    },
    {
      buttonId: usedPref+'menu',
      buttonText: {
        displayText: 'Menu Bot'
      },
      type: 1
    }]
  let locationMessage = {
    jpegThumbnail: logo[used_logo%3].buffer
  }
  used_logo = (used_logo+1)%3
  let buttonsMessage = {
    contentText: hasile,
    footerText: 'Gunakan bot dengan baik dan benar yah',
    locationMessage,
    buttons,
    headerType: "LOCATION"
  }
  return client.sendMessageFromContent(msg.from, {
    buttonsMessage
  })
}
)

cmd.on('menu-cmd', ['menu'], ['info'], async (msg, {
  client,
  query,
  usedPref
}) => {
  let {
    list,
    body,
    upper,
    down,
    line,
    head
  } = botinfo.unicode
  let type = query && query.toLowerCase()
  let lama = []
  if (!cmd._tags[type]) {
    let sections = []
    let list_now = 0
    let list_nitip = {}
    for (let b in cmd._tags) {
      let tit = list_now == 0 ? `${upper}${list} ${list}${line.repeat(13)}${list} ${list_now+1} ${list}${line.repeat(13)}${list}`: `${body}${list} ${list}${line.repeat(13)}${list} ${list_now+1} ${list}${line.repeat(13)}${list}`
      sections.push({
        "title": tit,
        "rows": [{
          "title": `${b[0].toUpperCase()+b.slice(1).toLowerCase()} Menu`,
          "rowId": usedPref+`menu${b}`,
          "description": 'Membuka Menu '+ b[0].toUpperCase()+b.slice(1).toLowerCase()
        }]
      })
      list_nitip[b] = usedPref+`menu${b}`
      list_now++
    }
    return client.sendMessageFromContent(msg.from, {
      "listMessage": {
        "title": `*Hai _${msg.sender.name}_!*`,
        "description": "Berikut Daftar Menunya!",
        "footerText": `Tekan tombol yg bertuliskan "Daftar Menu" yaa! Jika Tidak Bisa Di Tekan, Tekan Tombol Baca Selengkapnya!${String.fromCharCode(8206).repeat(1000)}\n${functions.parseResult(list_nitip, {
          body: `${list} _%value_`
        })}`,
        "buttonText": "Daftar Menu",
        "listType": "SINGLE_SELECT",
        sections
      }
    })
  }
  for (let a of cmd._tags[type]) {
    if (!a.enable) continue;
    let prek = a.usedPrefix ? usedPref: ''
    let param = a.param? a.param: ''
    lama = lama.concat(a.command.map(value => prek + value+ ` ${param}`))
  }

  let hasil = `${head}${line.repeat(4)}${list} *${type[0].toUpperCase()+type.slice(1).toLowerCase()} Menu*\n`
  for (let b of lama) {
    hasil += list + ` ${b.toLowerCase()}\n`
  }

  hasil = hasil.trim()+`\n${head}${line.repeat(2)}${list}`
  buttons = [{
    buttonId: usedPref+'infopenggunaan',
    buttonText: {
      displayText: 'Cara penggunaan'
    },
    type: 1
  }]
  let buttonsMessage = {
    contentText: hasil,
    footerText: `Jika Tidak Bisa Tekan _Tombol_,Tekan Baca Selengkapnya!${functions.readmore(1000)}\n\n${list} _${usedPref}infopenggunaan_`,
    buttons,
    headerType: 1
  }
  return client.sendMessageFromContent(msg.from, {
    buttonsMessage
  })
})

cmd.on('menu-info', ['infopenggunaan'], ['info'], (msg, {
  client, prefix
}) => {
  return client.reply(msg, `*Hai* _${msg.sender.name}_
    Berikut Cara Penggunaan Bot


    Jika Terdapat Tanda _${botinfo.unicode.needed[0]}_ Dan _${botinfo.unicode.needed[1]}_ Artinya Di perlukan Sesuatu

    Contoh: _${botinfo.unicode.needed[0]}_Teks_${botinfo.unicode.needed[1]}_

    Artinya Diatas Diperlukan Teks

    Ada juga _${botinfo.unicode.optional[0]}_ Dan _${botinfo.unicode.optional[1]}_

    Artinya Itu Bisa Di Isi Bisa Tidak Sesuai Ada Mau (Opsional)

    *_Cara Penggunaan_*

    Untuk Penggunaan Silahkan Ketik:

    *fiturnya*

    Contoh: *${usedPref}menu*

    Di Nomor Bot Atau Di Grub Yang Terdapat Nomor Bot, Maka Bot Akan Merespon!

    Untuk Penggunaan Kedua Contohnya Jika Terdapat _${botinfo.unicode.needed[0]}_ Dan _${botinfo.unicode.needed[1]}_ Maka Kurung Tadi Jangan Di Anggap

    Contoh: *${usedPref}ytmp3 https://youtu.be/aHbakLal*


    Untuk Info Lebih Lanjut Ketik fiturnya --info


    Contoh: *${usedPref}menu --info*`)
})