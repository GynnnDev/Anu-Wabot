const help = (prefix, time, copid) => {
	return `「  *Bot Jb*  」

*⦿ Bot Prefix :* ${prefix} 
*⦿ Creator :* MhankBarBar
*⦿ Recode By :* @Zxbin/GalangYn
*⦿ Today :* ${time}

❒「  *Kasus Covid-19 Indonesia*  」
├ *Terinfeksi :* ${copid[0].kasus}
├ *Kematian :* ${copid[0].kematian}
└ *Sembuh :* ${copid[0].sembuh}


_Nemuin *Bug🐞?* Ketik *${prefix}bugreport* Untuk Melaporkan Bug!_


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

❑ *Musik*
├ *${prefix}joox* [Query]
├ *${prefix}soundcloud* [Url]
├ *${prefix}ytmp3* [Url]
├ *${prefix}tomp3*
└ *${prefix}play* [Query] [Options]
 
❒ *Searching*
├ *${prefix}ytsearch* [Query]
├ *${prefix}dafontsearch* [Query]
├ *${prefix}preview* teks|ukuran / teks|ukuran|namafont -font
└ *${prefix}ocr*
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶
Tanda Kurung [] Hiraukan Contoh Penggunaan
${prefix}play fly away
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶
⚠️JANGAN SPAM BOT INI !!..
🏠TETAP DI RUMAH AJA DAN LAKUKAN 3M
⊷⊷⊷⊷⊷⋙᪥⋘⊶⊶⊶⊶⊶⊶
`}

exports.help = help
