var alreadyConnected = false;

client.ev.on('connection.update', async(update) => {
  if (update.connection == 'open') {
    alreadyConnected = true
  } else if ((update.connection == 'close' ) && update.lastDisconnect?.error?.output?.statusCode != 401) process.send('reset');
})

client.ev.on ('creds.update', session.saveState)