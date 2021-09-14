class Command {
constructor(client, botinfo, functions) {
this._events = [];
this._tags = {}
this.default_prefix = /^z/;
this.prefix = botinfo.prefix.map(tr => tr instanceof RegExp? tr : new RegExp(functions.parseRegex(tr),'i'))
this.client = client;
this.functions = functions;
this.botinfo = botinfo;
}

on(eventName, command = [], tags = [], callback = () => {}, opt = {}) {
let eventObj = Object.keys(this._events);
let nitip = !this._events[eventName] ? `Loading Event|Command ${eventName}` : `Checking Event|Command ${eventName}`;
let regCommand = command.map(tr => tr instanceof RegExp? tr : new RegExp(`^(${functions.parseRegex(tr)})`,'i'))
this._events.push({eventName,_command: regCommand,command: command,callback,usedPrefix:true,enable:true,tags,info:'Tidak Ada Info',...opt});
this.functions.logLoading(`${nitip}`);
for (let a of tags){
this._tags[a] = {...this._tags[a]}
this._tags[a][eventName] = {eventName,_command: regCommand,command: command,callback,usedPrefix:true,enable:true,tags,info:'Tidak Ada Info',...opt};
}
}

modify(name = '', objectName = '', toValue = '') {
let index = this._events.findIndex(tr => tr.eventName == name)
if (!this._events[name]) return
this._events[index][objectName] = toValue;
return this._events[index];
}

execute(msg){
return new Promise(async(resolve,reject) => {
for (let event of this._events){
try {
if (!event.enable) continue;
let findPrefix = this.prefix.find(tr => tr.exec(msg.string))
let prefix = !event.usedPrefix ? event._command.find(tr => tr.test(msg.string)) && event._command.find(tr => tr.test(msg.string)).exec(msg.string) : findPrefix && findPrefix.exec(msg.string) || this.default_prefix.exec(msg.string)
prefix = prefix || event.stc
if (!prefix) continue;
let usedPref = prefix[0];
let stringCmd = event.usedPrefix ? msg.string.replace(usedPref,'') : msg.string
let findCmd = event._command.find(tr => tr.test(stringCmd))
let cmd = findCmd && findCmd.exec(stringCmd)
cmd =  (typeof msg.body == 'object' && event.stc && event.stc == msg.body.fileSha256) ? [event.eventName] : cmd;
if (!cmd) continue;
let command = cmd[0];
let commandNpref = event.usedPrefix ? usedPref+command : command;
let args = msg.string.split(' ');
let text = msg.string;
let query = msg.string.replace(commandNpref,"").trim();
let number = Number(msg.string.replace(/[^0-9]/g,''));
let isOwner = msg.isOwner;
let group = msg.isGroup? await msg.groupMetadata() : false;
let isAdmin = msg.isGroup ? group.isSenderAdmin : false;
let isClientAdmin = msg.isGroup ? group.isClientAdmin : false;
let quotedMsg = msg.quotedMsg ? await msg.loadQuotedMsg() : false;
let isUrl = this.functions.isUrl(query);
if (event.group && !msg.isGroup){
let resultResponse = typeof event.group == 'boolean'?this.botinfo.response.group:event.group
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.private && msg.isGroup){
let resultResponse = typeof event.private== 'boolean'?this.botinfo.response.private:event.private
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.admin && !isAdmin){
let resultResponse = typeof event.admin == 'boolean'?this.botinfo.response.admin:event.admin
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.clientAdmin && !isClientAdmin){
let resultResponse = typeof event.clientAdmin == 'boolean'?this.botinfo.response.clientAdmin:event.clientAdmin
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.owner && !isOwner){
let resultResponse = typeof event.owner == 'boolean'?this.botinfo.response.owner:event.owner
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.fromMe && quotedMsg && !quotedMsg.fromMe){
let resultResponse = typeof event.fromMe == 'boolean'?this.botinfo.response.fromMe:event.fromMe
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.query && query.length < 1){
let resultResponse = typeof event.query == 'boolean'?this.botinfo.response.query:event.query
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.url && !query.startsWith('http')) query = 'http://' + query;
if (event.url && !isUrl) {
let resultResponse = typeof event.url == 'boolean'?this.botinfo.response.notUrl:event.url
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
//if (event.url && isUrl && !(new RegExp(this.functions.parseRegex(event.url),'gi').test(isUrl[0]))) return this.client.reply(msg,this.botinfo.response.notUrl + `, Link Yang Anda Masukan Bukan Dari ${event.url}`);
if (event.media && !msg.isMedia){
let resultResponse = typeof event.media == 'boolean'?this.botinfo.response.media:event.media
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.mention && !msg.mentionedJid){
let resultResponse = typeof event.mention == 'boolean'?this.botinfo.response.mention:event.mention
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.quoted && !msg.quotedMsg) {
let resultResponse = typeof event.quoted == 'boolean'?this.botinfo.response.quoted:event.quoted
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event._media && !msg.isMedia && (!quotedMsg || quotedMsg && !quotedMsg.isMedia)){
let resultResponse = typeof event._media == 'boolean'?this.botinfo.response._media:event._media
if (resultResponse == '--noresp') return
return this.client.reply(msg,resultResponse);
}
if (event.info && msg.string.endsWith("--info")) return this.client.reply(msg,event.info);
if (event.usage && msg.string.endsWith("--contoh")) return await event.usage({text,group,isUrl,isAdmin,isClientAdmin,query,command,commandNpref,prefix,usedPref,args,cmd,number,msg,client:this.client,quotedMsg});
await event.callback(msg,{text,group,isUrl,isAdmin,isClientAdmin,query,command,commandNpref,prefix,usedPref,args,cmd,number,...msg,client:this.client,quotedMsg})
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
