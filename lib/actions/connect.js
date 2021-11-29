var alreadyConnected = false;

client.ev.on('connection.update', async(update) => {
  if (update.connection == 'open') {
    alreadyConnected = true
  } else if (update.connection == 'close' && update.lastDisconnect.error?.output?.statusCode !== baileys.DisconnectReason.loggedOut) process.send('reset')
  console.log(update)
})

client.ev.on ('creds.update', session.saveState)