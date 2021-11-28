var alreadyConnected = false;

client.ev.on('connection.update', async(update) => {
  if (update.connection == 'open') {
    alreadyConnected = true
  }
  console.log(update)
})

client.ev.on ('creds.update', session.saveState)