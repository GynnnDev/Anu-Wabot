const baileys = require('@adiwajshing/baileys')
const jimp = require('jimp')
const fs = require('fs')
const fetch = require('node-fetch');
const util = require('util');
const fakeUa = require('fake-useragent');
const ffmpeg = require('fluent-ffmpeg');
const FileType = require('file-type')
const {
  exec,
  spawn,
  execSync
} = require('child_process');

module.exports = class WAConnection extends baileys.WAConnection {
  async reply(mess, text, opt) {
    return await this.sendMessage(mess.key.remoteJid, util.format(text), baileys.MessageType.extendedText, {
      quoted: mess, ...opt
    })
  }
  async getBuffer(path, save, auto_ext = true) {
    let buffer = Buffer.isBuffer(path) ? path: /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64'): /^https?:\/\//.test(path) ? await (await fetch(path, {
      headers: {
        'User-Agent': fakeUa()}})).buffer(): fs.existsSync(path) ? fs.readFileSync(path): typeof path === 'string' ? path: Buffer.alloc(0);
    let anu = await FileType.fromBuffer(buffer) || {
      ext: 'bin',
      mime: 'application/octet-stream'
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
  async sendMessageFromContent(jid, obj, opt = {}) {
    let prepare = await this.prepareMessageFromContent(jid, obj, opt)
    await this.relayWAMessage(prepare)
    return prepare
  }
  async fakeReply(jid, message, type, opt, fakeJid, participant, fakeMessage) {
    return await this.sendMessage(jid, message, type, {
      quoted: {
        key: {
          fromMe: jid == this.user.jid, participant, remoteJid: fakeJid
        },
        "message": fakeMessage
      },
      ...opt
    })
  }
  getMentionedJidList(text) {
    try {
      return text.match(/@(\d*)/g).map(x => x.replace('@', '')+'@s.whatsapp.net') || [];
    } catch(e) {
      return []
    }
  }
  async prepareSticker(path, exifFile) {
    let getBuf = (await this.getBuffer(path))
    let {
      ext,
      mime
    } = getBuf
    let buf = getBuf.buffer
    if (!fs.existsSync("./tmp")) fs.mkdirSync('tmp')
    let fileName = `./tmp/${Date.now()}.${ext}`
    let output = fileName.replace(ext, 'webp')
    fs.writeFileSync(fileName, buf)
    if (ext == 'webp') {
      if (exifFile) {
        return new Promise((resolve, reject) => {
          exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`, (err) => {
            if (err) throw err
            let result = fs.readFileSync(output)
            fs.unlinkSync(output)
            resolve(result)
          })
        })
      } else {
        let result = fs.readFileSync(output)
        fs.unlinkSync(output)
        return result
      }
    }
    return new Promise(async(resolve, reject) => {
      await ffmpeg(fileName).input(fileName).on('error', function (err) {
        fs.unlinkSync(fileName)
        reject(err)
      }).on('end', function () {
        if (exifFile) {
          exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`, (err) => {
            if (err) return err
            let result = fs.readFileSync(output)
            fs.unlinkSync(fileName)
            fs.unlinkSync(output)
            resolve(result)
          })
        } else {
          let result = fs.readFileSync(output)
          fs.unlinkSync(fileName)
          fs.unlinkSync(output)
          resolve(result)
        }
      }).addOutputOptions([`-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(output)
    })
  }
  async sendImage(jid, path, caption, opt) {
    let buff = (await this.getBuffer(path)).buffer
    return await this.sendMessage(jid, buff, 'imageMessage', {
      caption, ...opt
    })
  }
  async sendVideo(jid, path, caption, opt) {
    let buff = (await this.getBuffer(path)).buffer
    return await this.sendMessage(jid, buff, 'videoMessage', {
      caption, ...opt
    })
  }
  async sendLocation(jid, property, opt) {
    return await this.sendMessageFromContent(jid, {
      locationMessage: property
    }, opt)
  }
  async sendLiveLocation(jid, property, opt) {
    return await this.sendMessageFromContent(jid, {
      liveLocationMessage: property
    }, opt)
  }
  async sendProduct(jid, property, opt) {
    return await this.sendMessageFromContent(jid, {
      productMessage: property
    }, opt)
  }
  async sendButton(jid, message, type, button = [], opt = {}) {
    message = (
      await this.prepareMessage(`0@s.whatsapp.net`,
        message,
        type,
        opt).catch(async(e) => {
          let err = util.format(e).toLowerCase()
          if (err.includes('marker')) {
            return await this.prepareMessage(`0@s.whatsapp.net`, message, type, {
              ...opt, thumbnail: await this.resizeImage(message, '48x48')})
          } else if (err.includes('this.isZero')) {
            return await this.prepareMessage(`0@s.whatsapp.net`, message, type, {
              ...opt, quoted: null
            })
          }
        })
    ).message;
    let isMedia = !(type == 'conversation' || type == 'extendedTextMessage');
    message = message[type] || message;
    let headerType = type
    .toUpperCase()
    .replace('MESSAGE', '')
    .replace(`EXTENDED`, '')
    .replace(`CONVERSATION`, 'EMPTY')
    .trim();
    let buttons = [];
    for (let a of button) {
      buttons.push({
        type: 'RESPONSE', buttonText: {
          displayText: a.text
        }, buttonId: a.id
      });
    }
    let contentText =
    opt.content || (type == baileys.MessageType?.text
      ? message.extendedTextMessage?.text: Object.keys(message).includes('caption')
      ? message.caption: ' ');
    let footerText = opt.footer;
    let content = isMedia ? {
      [type]: message
    }: headerType == 'TEXT' ? {
      ...message
    }: {};
    return this.sendMessageFromContent(
      jid,
      {
        buttonsMessage: {
          contentText, footerText, headerType, buttons, ...content
        }
      },
      {
        ...opt
      },
    );
  }
  async sendFileFromUrl(id, url, qu, caption = "", filename = "file", opt = {}) {
    const buffers = await axios(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.585 Mobile Safari/534.11+'
      }, responseType: "arraybuffer", ...opt.headers
    }).catch(e => {
      throw e
    })
    var mimtype = buffers.headers["content-type"]
    mimtype = mimtype == 'image/gif' ? 'video/gif': mimtype == 'image/jpg' ? 'image/jpeg': mimtype
    const msgtype = mimtype && mimtype.includes('image') ? 'imageMessage': mimtype && mimtype.includes('audio') ? 'audioMessage': mimtype && mimtype.includes('video') || mimtype && mimtype.includes('gif')  ? 'videoMessage': 'documentMessage'
    filename = mimtype == 'image/jpeg' ? null: filename
    mimtype = mimtype == 'image/jpeg' ? null: mimtype
    return await this.sendMessage(id, buffers.data, msgtype, {
      quoted: qu, mimetype: mimtype, filename: filename, caption: caption, contextInfo: {
        "mentionedJid": this.getMentionedJidList(caption)}, ...opt
    })
  }
  async sendSticker(jid, path, opt, exifFile) {
    let prepare;
    if (exifFile) {
      prepare = await this.prepareSticker(path, exifFile)
    } else {
      prepare = await this.prepareSticker(path)
    }
    return await this.sendMessage(jid, prepare, baileys.MessageType.sticker, opt)
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

  async sendMessage(id, message, type, options = {}) {
    let waMessage = await this.prepareMessage(id, message, type, options).catch(async(e) => {
      let err = util.format(e).toLowerCase()
      if (err.includes('marker')) {
        return await this.prepareMessage(id, message, type, {
          ...options, thumbnail: await this.resizeImage(message, '48x48')})
      } else if (err.includes('this.isZero')) {
        return await this.prepareMessage(id, message, type, {
          ...options, quoted: null
        })
      }
    })
    await this.relayWAMessage(waMessage,
      {
        waitForAck: options.waitForAck !== false
      });
    return waMessage;
  }
}
