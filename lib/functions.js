const fs = require('fs')
const fetch = require('node-fetch');
const util = require('util');
const cheerio = require('cheerio');
const ytSearch = require('yt-search');
const googleSearch = require('google-it')
const FileType = require('file-type');
const spin = require('spinnies');
const axios = require('axios');
const jimp = require('jimp')
const moment = require('moment-timezone');
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const googleImage = require('g-i-s');
const Crypto = require('crypto');
const fakeUa = require('fake-useragent');
const baileys = require('@adiwajshing/baileys');
const qrcode = require('qrcode');
const FormData = require('form-data')
const {
  exec,
  spawn,
  execSync
} = require('child_process');

module.exports = class Functions {
  constructor() {
    this.qrcode = qrcode;
    this.ffmpeg = ffmpeg;
    this.fakeUa = fakeUa;
    this.exec = exec;
    this.spins = spin;
    this.spawn = spawn;
    this.baileys = baileys;
    this.cheerio = cheerio;
    this.moment = moment;
    this.util = util;
    this.fs = fs;
    this.fetch = fetch;
    this.axios = axios;
    this.util = util;
    this.FileType = FileType;
    this.ytSearch = ytSearch;
    this.chalk = chalk;
    this.animate = new spin();
  }

  readmore(length) {
    return String.fromCharCode(8206).repeat(length)
  }

  pad(num) {
    return (num < 10 ? '0': '') + num;
  }

  needed(str) {
    return botinfo.unicode.needed[0]+str+botinfo.unicode.needed[1]
  }

  optional(str) {
    return botinfo.unicode.optional[0]+str+botinfo.unicode.optional[1]
  }

  logLoading(teks) {
    if (!Object.keys(this.animate.spinners).includes("Loading")) {
      this.animate.add('Loading', {
        text: teks
      });
    } else {
      this.animate.update('Loading', {
        text: teks
      });
    }
    return;
  }

  logColor(text, color) {
    return chalk.keyword(color)(text);
  }

  parseResult(json, options = {}) {
    let {
      list,
      head,
      upper,
      down,
      line
    } = botinfo.unicode
    let opts = {
      unicode: true,
      ignoreVal: [null,
        undefined],
      ignoreKey: [],
      title: botinfo.botname,
      headers: `${head}${line.repeat(4)}${list} _*%title*_`,
      body: `${list} *%key*: _%value_`,
      footer: head+line+line+line+list+'\n',
      ...options,
    };
    let {
      unicode,
      ignoreKey,
      title,
      headers,
      ignoreVal,
      body,
      footer
    } = opts;

    let obj = Object.entries(json);
    let tmp = [];
    for (let [_key, val] of obj) {
      if (ignoreVal.indexOf(val) !== -1) continue;
      let key = _key[0].toUpperCase() + _key.slice(1);
      let type = typeof val;
      if (ignoreKey && ignoreKey.includes(_key)) continue;
      switch (type) {
        case 'boolean':
          tmp.push([key, val ? 'Ya': 'Tidak']);
          break;
        case 'object':
          if (Array.isArray(val)) {
            tmp.push([key, val.join(', ')]);
          } else {
            tmp.push([
              key,
              this.parseResult(val, {
                ignoreKey, unicode: false
              }),
            ]);
          }
          break;
        default:
          tmp.push([key, val]);
          break;
      }
    }
    if (unicode) {
      let text = [
        headers.replace(/%title/g, title),
        tmp
        .map((v) => {
          return body.replace(/%key/g, v[0]).replace(/%value/g, v[1]);
        })
        .join('\n'),
        footer,
      ];
      return text.join('\n').trim();
    }
    return tmp;
  }

  createExif(packname, authorname, filename) {
    if (!filename) filename = 'data';
    let json = {
      'sticker-pack-id': 'CreateByAqul-RemasteredByZbin',
      'sticker-pack-name': packname,
      'sticker-pack-publisher': authorname,
    };
    let stringify = JSON.stringify(json).length;
    let f = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
    let code = [0x00,
      0x00,
      0x16,
      0x00,
      0x00,
      0x00];
    if (stringify > 256) {
      stringify = stringify - 256;
      code.unshift(0x01);
    } else {
      code.unshift(0x00);
    }
    let fff = Buffer.from(code);
    const ffff = Buffer.from(JSON.stringify(json));
    if (stringify < 16) {
      stringify = stringify.toString(16);
      stringify = '0' + stringify;
    } else {
      stringify = stringify.toString(16);
    }
    const ff = Buffer.from(stringify, 'hex');
    const buffer = Buffer.concat([f, ff, fff, ffff]);
    if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
    fs.writeFileSync(`./tmp/${filename}.exif`, buffer);
    return `./tmp/${filename}.exif`;
  }


  randomize(obj) {
    if (obj instanceof Array) return obj[Math.floor(Math.random()*obj.length)]
    if (typeof obj == 'number') return Math.floor(Math.random()*obj)
  }


  getTime(format, date) {
    if (date) {
      return moment(date).locale('id').format(format);
    } else {
      return moment.tz('Asia/Jakarta').locale('id').format(format);
    }
  }

  sizeName(number) {
    let tags = ["",
      "K",
      "M",
      "G",
      "T",
      "P",
      "E"];
    let tier = Math.log10(Math.abs(number)) / 3 | 0;
    if (tier == 0) return number;
    let tag = tags[tier];
    let scale = Math.pow(10, tier * 3);
    let scaled = number / scale;
    let formatted = scaled.toFixed(1);
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2);
    return formatted + tag + 'b';
  }

  isUrl(url) {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
  }

  parseRegex(string) {
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  count(sec) {
    let hours = this.pad(Math.floor(sec / (60*60)));
    let minutes = this.pad(Math.floor(sec % (60*60) / 60));
    let seconds = this.pad(Math.floor(sec % 60));
    return {
      hours,
      minutes,
      seconds
    };
  }

  async metadataMsg(client, msg) {
    let chatMeta = async(mess) => {
      mess = JSON.parse(JSON.stringify(mess))
      mess.message = {
        ...mess?.message
      }
      mess.key = {
        ...mess?.key
      }
      mess.sender = {}
      mess.realType = Object.keys(mess.message)[0]
      mess.message = mess.realType == 'ephemeralMessage'?mess.message.ephemeralMessage.message: mess.message
      mess.message = mess.realType == 'viewOnceMessage'? mess.message[mess.realType].message: mess.message
      mess.type = Object.keys(mess.message)[0]
      mess.data = typeof mess.message[mess.type] == "object" ? Object.keys(mess.message[mess.type]).includes("contextInfo") ? Object.keys(mess.message[mess.type]).concat(Object.keys(mess.message[mess.type].contextInfo)): Object.keys(mess.message[mess.type]): Object.keys(mess.message)
      mess.string = (mess.type === baileys.MessageType.text) ? mess.message.conversation: (mess.data.includes('caption')) ? mess.message[mess.type].caption: (mess.type == baileys.MessageType.extendedText) ? mess.message[mess.type].text: (mess.type == 'buttonsResponseMessage') ? mess.message[mess.type].selectedButtonId: (mess.type == 'listResponseMessage') ? mess.message[mess.type].singleSelectReply.selectedRowId: ''
      mess.body = mess.message[mess.type]
      mess.from = mess.key.remoteJid
      mess.isGroup = mess.from.endsWith('g.us')
      mess.sender.jid = mess.isGroup ? mess.participant ? mess.participant: client.user.jid: mess.key.remoteJid
      mess.sender.name = client.contacts[mess.sender.jid] ? client.contacts[mess.sender.jid].name || client.contacts[mess.sender.jid].vname || client.contacts[mess.sender.jid].notify || client.contacts[mess.sender.jid].short || 'Unknown': 'Unknown';
      mess.client = {};
      mess.client.name = client.user.name;
      mess.client.jid = client.user.jid;
      mess.mentionedJid = mess.data.includes('contextInfo') && mess.data.includes('mentionedJid')? mess.message[mess.type].contextInfo.mentionedJid: false;
      mess.isText = mess.type == 'conversation' || mess.type == 'extendedTextMessage'
      mess.isMedia = !mess.isText
      mess.id = mess.key.id
      mess.fromMe = mess.key.fromMe
      mess.quotedMsg = mess.data.includes('contextInfo') && mess.data.includes('quotedMessage')? {
        key: {
          remoteJid: mess.from,
          fromMe: mess.message[mess.type].contextInfo.participant == client.user.jid,
          id: mess.message[mess.type].contextInfo.stanzaId
        },
        message: mess.message[mess.type].contextInfo.quotedMessage,
        participant: mess.message[mess.type].contextInfo.participant
      }: false
      mess.isOwner = botinfo.ownerNumber.includes(mess.sender.jid.split('@')[0]) || mess.key.fromMe
      mess.groupData = mess.isGroup ? client.chats.get(mess.from): false
      mess.groupData = mess.groupData ? {
        ...mess.groupData,
        ...mess.groupData?.metadata
      }: false;
      delete mess.groupData.metadata;
      delete mess.groupData.messages;
      var x = await this.ambilSender(client, mess) || {}
      mess.groupData = mess.groupData ? {
        ...mess?.groupData,
        ...x
      }: false
      mess.sender = {
        ...x?.sender,
        ...mess?.sender
      }
      mess.client = {
        ...x?.client,
        ...mess?.client
      }


      //function
      mess.downloadMsg = async(save, auto_ext = true) => {
        if (mess.isText) return;
        let buffer = await client.downloadMediaMessage(mess);
        let anu = await FileType.fromBuffer(buffer) || {
          ext: 'bin',
          mime: 'application/octet-stream'
        }
        if (save) {
          save = auto_ext?save+'.'+anu.ext: save
          fs.writeFileSync(save, buffer);
          return {
            buffer,
            filename: save,
            ...anu
          };
        } else {
          return {
            buffer,
            ...anu
          };
        }
      };
      mess.deleteMsg = async(forAll) => {
        if (forAll) return await client.deleteMessage(mess.key.remoteJid, mess.key);
        return await client.clearMessage(mess.key);
      };
      mess.loadQuotedMsg = async() => {
        if (!mess.quotedMsg) return;
        return await chatMeta(await client.loadMessage(mess.from, mess.quotedMsg.key.id))
      };
      mess.reloadMsg = async() => {
        return await chatMeta(await client.loadMessage(mess.from, mess.key.id))
      };
      mess.resendMsg = async(jid, opt) => {
        return await client.sendMessageFromContent(jid, mess.message, opt);
      };
      mess.forwardMsg = async(jid, force, opt) => {
        let message = await client.generateForwardMessageContent(mess, force)
        return client.sendMessageFromContent(jid, message, opt)
      }
      mess.modifyMsg = async(object) => {
        return {
          ...mess,
          ...object
        }
      }
      mess.groupMetadata = async() => {
        if (!mess.isGroup) return;
        let groupMetadata = mess.groupData?.participants ? mess.groupData: await client.groupMetadata(mess.from).catch(e => {});
        groupMetadata.client = (groupMetadata.participants.find(res => res.jid == client.user.jid)) || {
          isAdmin: false,
          isSuperAdmin: false,
          jid: client.user.jid
        }
        groupMetadata.client.isAdmin = groupMetadata?.client?.isAdmin || groupMetadata?.client?.isSuperAdmin
        groupMetadata.sender = (groupMetadata.participants.find(ros => ros.jid == mess.sender.jid)) || {
          isAdmin: false,
          isSuperAdmin: false,
          jid: mess.sender.jid
        }
        groupMetadata.sender.isAdmin = groupMetadata?.sender?.isAdmin || groupMetadata?.sender?.isSuperAdmin
        groupMetadata.groupAdmins = groupMetadata.participants.filter(tr => tr.isAdmin || tr.isSuperAdmin) || []
        groupMetadata.groupMembers = groupMetadata.participants.filter(tr => !tr.isAdmin || !tr.isSuperAdmin) || []
        mess.sender = {
          ...groupMetadata.sender,
          ...mess?.sender
        }
        mess.client = {
          ...groupMetadata.client,
          ...mess?.client
        }
        return {
          ...groupMetadata
        }
      }
      mess.quotedMsg = mess.quotedMsg ? await chatMeta(mess.quotedMsg): false
      return mess;
    };
    return await chatMeta(msg)
  }

  async ambilSender(client, mess) {
    if (!mess.isGroup) return;
    let groupMetadata = mess.groupData?.participants ? mess.groupData: await client.groupMetadata(mess.from).catch(e => {});
    groupMetadata.client = (groupMetadata.participants.find(res => res.jid == client.user.jid)) || {
      isAdmin: false,
      isSuperAdmin: false,
      jid: client.user.jid
    }
    groupMetadata.client.isAdmin = groupMetadata?.client?.isAdmin || groupMetadata?.client?.isSuperAdmin
    groupMetadata.sender = (groupMetadata.participants.find(ros => ros.jid == mess.sender.jid)) || {
      isAdmin: false,
      isSuperAdmin: false,
      jid: mess.sender.jid
    }
    groupMetadata.sender.isAdmin = groupMetadata?.sender?.isAdmin || groupMetadata?.sender?.isSuperAdmin
    groupMetadata.groupAdmins = groupMetadata.participants.filter(tr => tr.isAdmin || tr.isSuperAdmin) || []
    groupMetadata.groupMembers = groupMetadata.participants.filter(tr => !tr.isAdmin || !tr.isSuperAdmin) || []
    mess.sender = {
      ...groupMetadata.sender,
      ...mess?.sender
    }
    mess.client = {
      ...groupMetadata.client,
      ...mess?.client
    }
    return {
      ...groupMetadata
    }
  }

  async resizeImage(path, size) {
    if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
    let buffer = await this.getBuffer(path, './tmp/'+Date.now().toString())
    if (!buffer.mime.includes('image')) return
    return new Promise((resolve, reject) => {
      exec(`mogrify -resize ${size} ${buffer.filename}`, (e, o) => {
        if (e) return reject(e)
        resolve(fs.readFileSync(buffer.filename))
        fs.unlinkSync(buffer.filename)
        return
      })
    })
  }

  async getBuffer(path, save, auto_ext = true) {
    let buffer = Buffer.isBuffer(path) ? path: /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64'): /^https?:\/\//.test(path) ? await (await fetch(path,
      {
        headers: {
          'User-Agent': fakeUa()}})).buffer(): fs.existsSync(path) ? fs.readFileSync(path): typeof path === 'string' ? path: Buffer.alloc(0);
    let anu = await FileType.fromBuffer(buffer) || {
      ext: 'bin', mime: 'application/octet-stream'
    }
    if (save) {
      save = auto_ext?save+'.'+anu.ext: save
      fs.writeFileSync(save, buffer)
      return {
        filename: save,
        buffer,
        ...anu
      }
    } else {
      return {
        buffer,
        ...anu
      }
    }
  }

  async searchImage(query) {
    return new Promise(async (resolve, reject) => {
      await googleImage(query, resultImage)
      function resultImage(error, result) {
        if (error) reject(error)
        if (result) resolve(result)
      }
    })
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async run(client) {
    try {
      await this.start();
      for (let a of fs.readdirSync('./lib/command')) require(`./command/${a}`)
      for (let b of fs.readdirSync('./lib/actions')) require(`./actions/${b}`);
      await this.delay(1000);
      this.animate.succeed('Loading', {
        text: 'Checking And Adding New Command Succeed'
      });
      client.logger.level = 'error';
      client.browserDescription = ['Zbin-Wabot',
        'Desktop',
        '3.0'];
      client.version = [2,
        2140,
        12];
      botinfo.session && await client.loadAuthInfo(botinfo.session);
      await client.connect({
        timeoutMs: 30000
      });
    } catch(e) {
      console.log(e)
    }
  }

  async start () {
    console.clear()
    let kali = fs.readFileSync('./src/kali.cat').toString()
    console.log(this.logColor(kali, 'silver'))
    console.log(this.logColor(`Starting Running Bot......`, 'silver'))
    await this.delay(3000)
    console.clear()
    console.log(this.logColor(` _____   __    _             ____        __
      /__  /  / /_  (_)___        / __ )____  / /_
      / /  / __ \\/ / __ \\______/ __  / __ \\/ __/
      / /__/ /_/ / / / / /_____/ /_/ / /_/ / /_
      /____/_.___/_/_/ /_/     /_____/\\____/\\__/

      `, 'silver'))
    await this.delay(1)
  }


  async googleSearch(query) {
    return googleSearch({
      query
    })
  }
}