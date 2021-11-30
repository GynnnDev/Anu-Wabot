const baileys = require('@adiwajshing/baileys-md')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const fetch = require('node-fetch');
const util = require('util');
const fakeUa = require('fake-useragent');
const FileType = require('file-type')
const {
  exec,
  spawn,
  execSync
} = require('child_process');

module.exports = class WAConnection {
  constructor(client) {
    for (let a in baileys) {
      this[a] = baileys[a]
    }
    for (let a in client) {
      this[a] = client[a]
    }
    this.client = client
  }
  async reply(mess, message, opt) {
    let prepared = typeof message == 'string'? {
      text: util.format(message)}: message
    return await this.sendMessage(typeof mess == 'object'?mess.key.remoteJid: typeof mess == 'object'? mess.key.remoteJid: mess, {
      ...prepared
    }, {
      quoted: typeof mess == 'object'?mess: null,
      ...opt
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
  async sendMessageFromContent(mess, obj, opt = {}) {
    let prepare = await this.generateWAMessageFromContent(typeof mess == 'object'?mess.key.remoteJid: mess, obj, opt)
    await this.relayMessage(prepare.key.remoteJid, prepare.message, {
      messageId: prepare.key.id
    })
    return prepare
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
    let fileName = `./tmp/${Date.now()}.${ext}`
    let output = fileName.replace(ext, 'webp')
    let buf = getBuf.buffer
    let {
      ext,
      mime
    } = getBuf
    if (!fs.existsSync("./tmp")) fs.mkdirSync('tmp')
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
  async sendImage(mess, path, caption, opt) {
    let buff = (await this.getBuffer(path)).buffer
    return await this.sendMessage(typeof mess == 'object'? mess.key.remoteJid: mess, {
      caption,
      image: buff,
      ...opt
    }, {
      caption, ...opt
    })
  }
  async sendVideo(mess, path, caption, opt) {
    let buff = (await this.getBuffer(path)).buffer
    return await this.sendMessage(typeof mess == 'object'? mess.key.remoteJid: mess, {
      caption, video: buff, ...opt
    })
  }
  async sendSticker(mess, path, opt, exifFile) {
    let prepare;
    if (exifFile) {
      prepare = await this.prepareSticker(path, exifFile)
    } else {
      prepare = await this.prepareSticker(path)
    }
    return await this.sendMessage(typeof mess == 'object'? mess.key.remoteJid: mess, {
      sticker: prepare, ...opt
    })
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

}