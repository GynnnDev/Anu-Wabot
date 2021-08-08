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
let uni = botinfo.unicode;
let atas = `${uni.upper}${uni.line.repeat(2)}${uni.head} Data Yang Di Terima`;
let kiri = `${uni.body}${uni.list}`;
let bawah = `${uni.down}${uni.head}`;
let data = `\n${atas}
${uni.body}
${kiri} NamaOwner: ${botinfo.ownername}
${kiri} Namabot: ${botinfo.botname}
${kiri} Namabot Di Wa: ${client.user.name}
${kiri} Nomor Bot: ${client.user.jid.split('@')[0]}
${kiri} Link Bot: https://wa.me/${client.user.jid.split('@')[0]}
${kiri} Owner Utama: ${botinfo.ownerNumber[0]}
${kiri} Link Owner: https://wa.me/${botinfo.ownerNumber[0]}
${kiri} Prefix: ${botinfo.prefix}
${kiri} Tanggal: ${functions.getTime('LLLL')}
${kiri} Jam: ${functions.getTime('HH:mm')}
${kiri} Merk Hp: ${client.user.phone.device_manufacturer}
${bawah}`;
botinfo.session = client.base64EncodedAuthInfo();
functions.fs.writeFileSync('./src/json/botInfo.json',JSON.stringify(botinfo,null,2));
});

client.on('close',({isReconnecting,reason}) => {
isReconnecting?console.log(functions.logColor(`✖ Koneksi Terputus, Mencoba Mengubungkan Ulang...`,'red')):console.log(functions.logColor(`✖ Koneksi Terputus, Menutup Koneksi..`,'red')) && process.send('close')
})