client.on('chat-update',async(chat) => {
try {
if (!chat.hasNewMessage) return;
if (!Object.keys(chat.messages.array[0]).includes('message') || !Object.keys(chat.messages.array[0]).includes('key')) return;
const msg = await functions.metadataMsg(client, chat.messages.array[0]);
if (msg.key.id.length < 20 || msg.key.remoteJid == 'status@broadcast') return;
cmd.execute(msg)
cmd.handlerB(msg)	
} catch(e) {
console.log(e);
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, 'Info Error!', 'conversation');
await client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, functions.util.format(e), 'conversation');
return 1;
}
});