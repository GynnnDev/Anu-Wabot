client.ev.on('messages.upsert', async(chat) => {
  try {
    if (!Object.keys(chat.messages[0]).includes('message') || !Object.keys(chat.messages[0]).includes('key')) return;
    const msg = await functions.metadataMsg(client, chat.messages[0]);
    if (msg.key.id.length < 20 || msg.key.remoteJid == 'status@broadcast') return;
    cmd.execute(msg)
    cmd.handlerB(msg)
  } catch(e) {
    if (!String(e).includes('this.isZero')) {
      console.log(e);
      client.sendMessage(botinfo.ownerNumber[0]+'@s.whatsapp.net', functions.util.format(e), 'conversation')
    }
  }
});