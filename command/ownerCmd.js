cmd.on('eval',['>','=>'],['owner'],async(msg,{command,text}) => {

let parse = command.includes('=>') ? text.replace('=>','return ') : text.replace('>','')

try{
let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => { return e });
return client.reply(msg,functions.util.format(evaluate));
} catch(e){
return client.reply(msg,functions.util.format(e));
}
},{owner:true,usedPrefix:false})

cmd.on('exec',['\\$'],['owner'],async(msg,{query,commandNpref}) => {
try{
functions.exec(`${query}`,(err,out) => {
if (err) return client.reply(msg,functions.util.format(err));
client.reply(msg,functions.util.format(out));
});
} catch(e){
 return client.reply(msg,functions.util.format(e));
}
},{owner:true,usedPrefix:false})
