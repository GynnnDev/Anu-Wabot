//Hi Again!, This Example Part 2 
//You Can Also Add Many Command On 1 File


cmd.on('example2',['say'],['example'],(req,{query,client}) => {
  return client.reply(req,query);
},{query:'Input Your Text On The Message'});

cmd.on('example3',['ping'],['example'],async(req,{client}) => {
  let now = Date.now()
  await client.reply(req,'Testing Speed')
  let calculate = functions.count(Date.now-now)
  let result = `Speed Response Is ${calculate}`
  return client.reply(req,result)
});

/*
Here I Describe
~~~~~~~~~~~~~~~
You Can Use Callback As You Need, The Options Are Optional, Default Is usedPrefix
*/