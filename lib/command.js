class Command {
constructor(client, botinfo, functions) {
this._events = {}
this.default_prefix = /^z/
this.prefix = new RegExp(`^${botinfo.prefix.join('|')}`)
this.client = client
this.functions = functions
this.botinfo = botinfo
}

on(eventName, command = [], tags = [], callback = () => {}, opt = {}) {
let eventObj = Object.keys(this._events)
let nitip = !this._events[eventName] ? `Register Event|Command ${eventName}` : `Checking Event|Command ${eventName}`
this._events[eventName] = { eventName,command: new RegExp(`^${command.join('|')}`,'i'),_command: command,callback,usedPrefix:true,enable:true,tags,...opt}
this.functions.logLoading(`${nitip}`)
}

modify(name = '', objectName = '', toValue = '') {
if (!this._events[name]) return this._events[name]
this._events[name][objectName] = toValue
return this._events[name]
}
execute(msg){
return new Promise(async(resolve,reject) => {
for (let eventCmd in this._events){
try {
let event = this._events[eventCmd]
if (!event.enable) return
let prefix = !event.usedPrefix ? event.command.exec(msg.string) : this.prefix.exec(msg.string) || this.default_prefix.exec(msg.string)
if (!prefix) return 
let usedPref = prefix[0]
let cmd = event.command.exec(msg.string.replace(usedPref,''))
if (!cmd) return
let command = cmd[0]
let commandNpref = usedPref+command
let args = msg.string.split(' ')
let text = msg.string
let query = msg.string.replace(commandNpref)
let isOwner = msg.isOwner
let group = msg.isGroup? await msg.groupMetadata() : false
let isAdmin = msg.isGroup ? group.isSenderAdmin : false
let isClientAdmin = msg.isGroup ? group.isClientAdmin : false
let quotedMsg = msg.quotedMsg ? await msg.quotedMsgData() : false
let isUrl = this.functions.isUrl(query)
if (event.group && !msg.isGroup) return this.client.reply(msg,this.botinfo.response.group)
if (event.private && msg.isGroup) return this.client.reply(msg,this.botinfo.response.private)
if (event.admin && !isAdmin) return this.client.reply(msg,this.botinfo.response.admin)
if (event.clientAdmin && !isClientAdmin) return this.client.reply(msg,this.botinfo.response.botAdmin)
if (event.owner && !isOwner) return this.client.reply(msg,this.botinfo.response.owner) 
if (event.fromMe && quotedMsg && !quotedMsg.fromMe) return this.client.reply(msg,this.botinfo.response.fromMe)
if (event.query && query.length < 1) return this.client.reply(msg,event.query)
if (event.url && !query.startsWith('http')) query = 'http://' + query
if (event.url && !isUrl) return client.reply(msg,this.botinfo.response.notUrl)
if (event.url && isUrl && !(new RegExp(this.functions.str2Regex(event.url),'gi').test(isUrl[0]))) return this.client.reply(msg,this.botinfo.response.notUrl + `, Link Yang Anda Masukan Bukan Dari ${event.url}`)
if (event.media && !msg.isMedia) return client.reply(msg,this.botinfo.response.media)
if (event.mention && !msg.mentionedJid) return this.client.reply(msg,this.botinfo.response.mentioned)
if (event.quoted && !msg.quotedMsg) return this.client.reply(msg,this.botinfo.response.quoted)
if (event._media && !msg.isMedia && !quotedMsg || (quotedMsg && !quotedMsg.isMedia)) return this.client.reply(msg,this.botinfo.response._media)
await event.callback(msg,{client:this.client,text,group,isUrl,isAdmin,isClientAdmin,query,command,commandNpref,prefix,usedPref,args,cmd,prefix,usedPref,quotedMsg,...msg})
resolve({status:200,response:'ok',event:event.eventName})
} catch(e) {
let data = {response:'bad',status:0,event:eventName,error: functions.util.format(e)}
console.log(data)
this.client.sendMessage(this.botinfo.ownerNumber[0]+`@s.whatsapp.net`,this.functions.util.format(data),'conversation')
reject(data)
return this.client.reply(msg,this.botinfo.response.Error)
}
}
})
}
}

module.exports = Command;
