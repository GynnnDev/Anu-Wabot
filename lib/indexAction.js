client.on('chat-update',async(chat) => {
if (!chat.hasNewMessage) return;
if (!Object.keys(chat.messages.array[0]).includes('message') || !Object.keys(chat.messages.array[0]).includes('key')) return;
const msg = functions.metadataMsg(client, chat.messages.array[0]);
if (msg.key.id.length !== 32 || msg.key.remoteJid == 'status@broadcast') return;
try{
if (/^=?>/.test(msg.StringMsg) && (botinfo.ownerNumber.includes(msg.sender.split('@')[0]) || msg.key.fromMe)){
let parse = /^=>/.test(msg.StringMsg) ? msg.StringMsg.replace(/^=>/,'return ') : msg.StringMsg.replace(/^>/,'');
try{
let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => { return e });
return client.reply(msg,functions.util.format(evaluate));
 } catch(e){
 return client.reply(msg,functions.util.format(e));
}
}
if (msg.StringMsg.startsWith('$') && (botinfo.ownerNumber.includes(msg.sender.split('@')[0]) || msg.key.fromMe)){
let parse = msg.StringMsg.replace("$",'');
try{
functions.exec(parse,(err,out) => {
if (err) return client.reply(msg,functions.util.format(err));
client.reply(msg,functions.util.format(out));
});
} catch(e){
 return client.reply(msg,functions.util.format(e));
}
}
} catch(e) {
console.log(e);
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, 'Info Error!', 'conversation');
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, functions.util.format(e), 'conversation');
return 1;
}
});