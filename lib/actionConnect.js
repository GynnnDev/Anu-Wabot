var alreadyConnected = false;

client.on('qr', (qr) => console.log('Scan aQr Di Atas'));

client.on('connecting', (anu,ena) => { 
if(alreadyConnected){
functions.animate.add('Connecting',{text:'Menghubungkan Ulang Ke Koneksi.....'});
} else {
functions.animate.add('Connecting',{text:'Menghubungkan Ke Koneksi.....'});
alreadyConnected = true
}
});

client.on('open', () => {
functions.animate.succeed('Connecting',{text: 'Sukses Terhubung:)'});
botinfo.session = client.base64EncodedAuthInfo();
functions.fs.writeFileSync('./src/json/botInfo.json',JSON.stringify(botinfo,null,2));
});

client.on('close',({isReconnecting,reason}) => {
isReconnecting?console.log(functions.logColor(`✖ Koneksi Terputus, Mencoba Mengubungkan Ulang...`,'red')):console.log(functions.logColor(`✖ Koneksi Terputus, Menutup Koneksi..`,'red')) && process.send('close')
})
