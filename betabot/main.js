const { exec,execSync,spawn } = require('child_process');
const { WAConnection, Functions }= require('./lib/functions.js');
const Command = require('./lib/command.js');
const baileys = require('@adiwajshing/baileys');

global.media = require('./src/json/media.json');
global.botinfo = require('./src/json/botInfo.json');
global.userDb = require('./src/json/user.json');
global.groupDb = require('./src/json/group.json');
global.functions = new Functions();
global.client = new WAConnection();
global.cmd = new Command(client, global.botinfo, global.functions);
global.logo = { buffer:functions.fs.readFileSync('./src/images/logo.jpg'),message:media.logo };
global.animate = new functions.spins();

async function run(){
	
console.clear();
console.log(functions.logColor(functions.fs.readFileSync('./src/kali.cat').toString(),'red'));
await functions.delay(700);
console.clear();
console.log(functions.logColor(functions.fs.readFileSync('./src/kali.cat').toString(),'lime'));
await functions.delay(700);
console.clear();
console.log(functions.logColor(functions.fs.readFileSync('./src/kali.cat').toString(),'silver'));
await functions.delay(700);

client.logger.level = 'warn';
client.browserDescription = ['Zbin-Wabot','Desktop','3.0'];
if (botinfo.session){
await client.loadAuthInfo(botinfo.session);
} else {
client.on('qr', async(qr) => console.log('Scan Qr Di Atas'));
}

client.on('open', () => {
console.log('connected');
botinfo.session = client.base64EncodedAuthInfo();
functions.fs.writeFileSync('./src/json/botInfo.json',JSON.stringify(botinfo,null,2));
});

await client.connect({timeoutMs: 30*1000});

client.on('chat-update',async(chat) => {
if (!chat.hasNewMessage) return;
if (!Object.keys(chat.messages.array[0]).includes('message') || !Object.keys(chat.messages.array[0]).includes('key')) return;
const msg = functions.metadataMsg(client, chat.messages.array[0]);
if (msg.key.id.length !== 32 || msg.key.remoteJid == 'status@broadcast') return;

cmd.prefix = new RegExp(`^${botinfo.prefix.join('|')}`);
try{
if (/^=?>/.test(msg.StringMsg) && (botinfo.ownerNumber.includes(msg.sender.split('@')[0]) || msg.key.fromMe)){
let parse = /^=>/.test(msg.StringMsg) ? msg.StringMsg.replace(/^=>/,'return ') : msg.StringMsg.replace(/^>/,'');
try{
let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => { return e });
return client.reply(msg,functions.util.format(evaluate));
 } catch(e){
 return client.reply(msg,functions.util.format(e));
}
}


if (msg.StringMsg.startsWith('$') && (botinfo.ownerNumber.includes(msg.sender.split('@')[0]) || msg.key.fromMe)){
let parse = msg.StringMsg.replace("$",'');
try{
exec(parse,(err,out) => {
if (err) return client.reply(msg,functions.util.format(err));
client.reply(msg,functions.util.format(out));
});
} catch(e){
 return client.reply(msg,functions.util.format(e));
}
}
} catch(e) {
console.log(e);
client.sendMessage(botinfo.ownerNumber[0] + `@s.whatsapp.net`, functions.util.format(e), 'conversation');
}
});

for (let a of functions.fs.readdirSync('./command')) require(`./command/${a}`);

}
run();
