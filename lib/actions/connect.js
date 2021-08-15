var alreadyConnected = false;

client.on('qr', (qr) => console.log('Scan Qr Di Atas'));

client.on('connecting', (anu,ena) => { 
if (alreadyConnected) {
functions.animate.add('Connecting',{text:'Menghubungkan Ulang Ke Koneksi '+client.user.name});
} else {
functions.animate.add('Connecting',{text:'Menghubungkan Ke Koneksi....'});
alreadyConnected = true
}
});

client.on('open', () => {
functions.animate.succeed('Connecting',{text: 'Sukses Terhubung Ke '+client.user.name});
let uni = botinfo.unicode;
let atas = `${uni.upper}${uni.line.repeat(2)}${uni.head} Data Yang Di Terima`;
let kiri = `${uni.body}${uni.list}`;
let bawah = `${uni.down}${uni.head}`;
botinfo.session = client.base64EncodedAuthInfo();
functions.fs.writeFileSync('./src/json/botInfo.json',JSON.stringify(botinfo,null,2));
});

client.on('close',({isReconnecting,reason}) => {
isReconnecting?console.log(functions.logColor(`✖ Koneksi Terputus, Mencoba Mengubungkan Ulang Ke `+client.user.name,'red')):console.log(functions.logColor(`✖ Koneksi Terputus, Menutup Koneksi `+client.user.name,'red')) && process.send('close')
})
