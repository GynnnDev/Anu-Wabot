cmd.on('eval',['>','=>'],['owner'],async(msg,res) => {
let parse = res.command.includes('=>') ? res.text.replace('=>','return ') : res.text.replace('>','')
try{
let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => { return e });
return client.reply(msg,functions.util.format(evaluate));
} catch(e){
return res.client.reply(msg,functions.util.format(e));
}
},{owner:true,usedPrefix:false});

cmd.on('exec',['\\$'],['owner'],async(msg,res) => {
try{
functions.exec(`${res.query}`,(err,out) => {
if (err) return client.reply(msg,functions.util.format(err));
client.reply(msg,functions.util.format(out));
});
} catch(e){
 return res.client.reply(msg,functions.util.format(e));
}
},{owner:true,usedPrefix:false})
