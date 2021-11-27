var alreadyConnected = false;

client.ev.on('connection.update', async(update) => {
  if (update.connection == open) {
    alreadyConnected = true
    functions.animate.succeed('Connecting', {
      text: 'Sukses Terhubung Ke '+client.user.name
    });
    functions.fs.writeFileSync('./src/json/botInfo.json', JSON.stringify(botinfo, null, 2));
  }
})

client.on('connecting', (anu, ena) => {
  if (alreadyConnected) {
    functions.animate.add('Connecting', {
      text: 'Menghubungkan Ulang Ke Koneksi '+client.user.name
    });
  } else {
    functions.animate.add('Connecting', {
      text: 'Menghubungkan Ke Koneksi....'
    });
  }
});