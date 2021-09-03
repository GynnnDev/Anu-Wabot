/*cmd.on('multipleclient',['multipleclient'],['owner'],async(msg,res) => {
let id = Date.now()+``
res.client.reply(msg,botinfo.wait);
clients[id] = new (require('../functions.js').WAConnection)()
clients[id].cmd = new (require('../command.js'))(clients[id],botinfo,functions)
clients[id].cmd._events = cmd._events

clients[id].on('qr', async(code) => {
let message = await res.client.sendMessage(msg.from,await functions.qrcode.toBuffer(code),'imageMessage',{quoted:msg,caption:'Scan Qr Ini!'});
await functions.delay(40000)
return res.client.deleteMessage(message.key.jid,message.key)
})


clients[id].on('chat-update',async(chat) => {
if (!chat.hasNewMessage) return;
if (!Object.keys(chat.messages.array[0]).includes('message') || !Object.keys(chat.messages.array[0]).includes('key')) return;
const msg = functions.metadataMsg(client, chat.messages.array[0]);
if (msg.key.id.length < 20 || msg.key.remoteJid == 'status@broadcast') return;
try{
clients[id].cmd.execute(msg)
} catch(e) {
console.log(e);
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, 'Info Error!', 'conversation');
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, functions.util.format(e), 'conversation');
return 1;
}
});

res.query && clients[id].loadAuthInfo(query)
clients[id].connect().catch(e => client.reply(msg,"Gagal Terhubung"))

return res.client.reply(msg,'Berhasil Menautkan Ke' + clients[id].user.name)
},{owner:true});
*/