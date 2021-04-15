const help = (prefix, copid, tanggal, jams, botname) => {
	return `「  *${botname}*  」

*⦿ Bot Prefix :* ${prefix} 
*⦿ Creator :* MhankBarBar
*⦿ Recode By :* @Zxbin/GalangYn
*⦿ Today :* ${tanggal}
*⦿ Jam :* ${jams}

❒「  *Kasus Covid-19 Indonesia*  」
├ *Terinfeksi :* ${copid[0].kasus}
├ *Kematian :* ${copid[0].kematian}
└ *Sembuh :* ${copid[0].sembuh}

❒ *Group Menu* 
├ *${prefix}setname* [text]
├ *${prefix}setdesc* [text]
├ *${prefix}setpp* [img]
├ *${prefix}promote* [tag]
├ *${prefix}demote* [tag]
├ *${prefix}leave*
├ *${prefix}tagall* 
├ *${prefix}hidetag*
├ *${prefix}nsfw* [1/0]
├ *${prefix}welcome* [1/0]
├ *${prefix}listadmin*
├ *${prefix}antilink* [1/0]
├ *${prefix}add* [62×××]
├ *${prefix}kick* [tag mem]
└ *${prefix}group* buka/tutup

❑ *Maker*
├ *${prefix}tomp3*
├ *${prefix}tovn*
├ *${prefix}sticker*
├ *${prefix}toimg*
└ *${prefix}tts* [Text]

❑ *Downloader*
├ *${prefix}ytmp3* [Url]
├ *${prefix}ytmp4* [Url]
├ *${prefix}dafontdown* [Url]
├ *${prefix}facebook* [Url]
├ *${prefix}instagram* [Url] [Options]
├ *${prefix}tiktok* [Url]
├ *${prefix}soundcloud* [Url]
├ *${prefix}pinterest* [Query]
├ *${prefix}play* [Query] [Options]
└ *${prefix}joox* [Query]

❑ *Searching*
├ *${prefix}ytsearch* [Query]
├ *${prefix}dafontsearch* [Query]
├ *${prefix}google* [Query]
├ *${prefix}wiki* [Query]
├ *${prefix}quotes* [Query]
├ *${prefix}preview* teks|ukuran 
└ *${prefix}ocr*
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶
Tanda Kurung [ ] Hiraukan Contoh :
*${prefix}play fly away*

_Nemuin *Bug🐞?* Ketik *${prefix}bugreport* Untuk Melaporkan Bug!_
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶
⚠️JANGAN SPAM BOT INI !!..
🏠TETAP DI RUMAH AJA DAN LAKUKAN 3M
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶⊶
`}

exports.help = help
