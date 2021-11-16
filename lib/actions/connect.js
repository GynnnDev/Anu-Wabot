var alreadyConnected = false;

client.on('qr', async(qr) =>{
  console.log('Scan Qr Di Atas')
  await functions.delay(7000)
  });

client.on('connecting', (anu,ena) => { 
if (alreadyConnected) {
functions.animate.add('Connecting',{text:'Menghubungkan Ulang Ke Koneksi '+client.user.name});
} else {
functions.animate.add('Connecting',{text:'Menghubungkan Ke Koneksi....'});
}
});

client.on('open', () => {
alreadyConnected = true
functions.animate.succeed('Connecting',{text: 'Sukses Terhubung Ke '+client.user.name});
botinfo.session = client.base64EncodedAuthInfo();
functions.fs.writeFileSync('./src/json/botInfo.json',JSON.stringify(botinfo,null,2));
});

client.on('close',({isReconnecting,reason}) => {
isReconnecting?console.log(functions.logColor(`✖ Koneksi Terputus, Mencoba Mengubungkan Ulang Ke `+client.user.name,'red')):console.log(functions.logColor(`✖ Koneksi Terputus, Menutup Koneksi`,'red')) && process.send('close')
})
