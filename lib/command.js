class Command {
constructor(client, botinfo, functions) {
this._events = {};
this._tags = {}
this.default_prefix = /^z/;
this.prefix = new RegExp(`^(${botinfo.prefix.join('|')})`);
this.client = client;
this.functions = functions;
this.botinfo = botinfo;
}

on(eventName, command = [], tags = [], callback = () => {}, opt = {}) {
let eventObj = Object.keys(this._events);
let nitip = !this._events[eventName] ? `Loading Event|Command ${eventName}` : `Checking Event|Command ${eventName}`;
this._events[eventName] = { eventName,command: new RegExp(`^(${command.join('|')})`,'i'),_command: command,callback,usedPrefix:true,enable:true,tags,...opt};
this.functions.logLoading(`${nitip}`);
for (let a of tags){
this._tags[a] = {...this._tags[a]}
this._tags[a][eventName] = { eventName,command: new RegExp(`^(${command.join('|')})`,'i'),_command: command,callback,usedPrefix:true,enable:true,tags,...opt};
}
}

modify(name = '', objectName = '', toValue = '') {
if (!this._events[name]) return this._events[name];
this._events[name][objectName] = toValue;
return this._events[name];
}

execute(msg){
return new Promise(async(resolve,reject) => {
for (let eventCmd in this._events){
try {
var event = this._events[eventCmd];
if (!event.enable) continue;
let prefix = !event.usedPrefix ? event.command.exec(msg.string) : this.prefix.exec(msg.string) || this.default_prefix.exec(msg.string)
prefix = event.stc ? true : prefix
if (!prefix) continue;
let usedPref = prefix[0];
let cmd = event.command.exec(event.usedPrefix ? msg.string.replace(usedPref,'') : msg.string);
cmd = event.stc ? (typeof msg.body == 'object' && event.stc == msg.body.fileSha256) ? [event.eventName] : null : cmd;
if (!cmd) continue;
let command = cmd[0];
let commandNpref = event.usedPrefix ? usedPref+command : command;
let args = msg.string.split(' ');
let text = msg.string;
let query = msg.string.replace(commandNpref,"");
let number = Number(msg.string.replace(/[^0-9]/g,''));
let isOwner = msg.isOwner;
let group = msg.isGroup? await msg.groupMetadata() : false;
let isAdmin = msg.isGroup ? group.isSenderAdmin : false;
let isClientAdmin = msg.isGroup ? group.isClientAdmin : false;
let quotedMsg = msg.quotedMsg ? await msg.quotedMsgData() : false;
let isUrl = this.functions.isUrl(query);
if (event.group && !msg.isGroup) return this.client.reply(msg,this.botinfo.response.group);
if (event.private && msg.isGroup) return this.client.reply(msg,this.botinfo.response.private);
if (event.admin && !isAdmin) return this.client.reply(msg,this.botinfo.response.admin);
if (event.clientAdmin && !isClientAdmin) return this.client.reply(msg,this.botinfo.response.botAdmin);
if (event.owner && !isOwner) return; //this.client.reply(msg,this.botinfo.response.owner) You Can Toogle On By Delete //
if (event.fromMe && quotedMsg && !quotedMsg.fromMe) return this.client.reply(msg,this.botinfo.response.fromMe);
if (event.query && query.length < 1) return this.client.reply(msg,event.query);
if (event.url && !query.startsWith('http')) query = 'http://' + query;
if (event.url && !isUrl) return client.reply(msg,this.botinfo.response.notUrl);
if (event.url && isUrl && !(new RegExp(this.functions.parseRegex(event.url),'gi').test(isUrl[0]))) return this.client.reply(msg,this.botinfo.response.notUrl + `, Link Yang Anda Masukan Bukan Dari ${event.url}`);
if (event.media && !msg.isMedia) return client.reply(msg,this.botinfo.response.media);
if (event.mention && !msg.mentionedJid) return this.client.reply(msg,this.botinfo.response.mentioned);
if (event.quoted && !msg.quotedMsg) return this.client.reply(msg,this.botinfo.response.quoted);
if (event._media && !msg.isMedia && (!quotedMsg || quotedMsg && !quotedMsg.isMedia)) return this.client.reply(msg,this.botinfo.response._media);
if (event.info && msg.string.endsWith("--info")) return this.client.reply(msg,event.info);
if (event.usage && msg.string.endsWith("--contoh")) return await event.usage();
await event.callback(msg,{text,group,isUrl,isAdmin,isClientAdmin,query,command,commandNpref,prefix,usedPref,args,cmd,prefix,usedPref,number,quotedMsg,...msg,client:this.client})
resolve({status:200,response:'ok',event:event,msg});
} catch(e) {
let data = {response:'bad',status:null,event:event.eventName,error: functions.util.format(e)};
console.log(data);
this.client.sendMessage(this.botinfo.ownerNumber[0]+`@s.whatsapp.net`,this.functions.util.format(data),'conversation');
return this.client.reply(msg,this.botinfo.response.Error);
}
}
});
}
}

module.exports = Command;
