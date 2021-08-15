//Hello There! This Is Example How To Create Command

/**
     * Make Some Command!
     * @param {String} Event Name, for Display On Menu
     * @param {Array} command, For Match string on message and commamd To Executed
     * @param {Array} Tags, For Display On Menu
     * @param {Function} Callback, For Execute
     * @param {Object} options, For Options Like info, snippet, just for owner or something 
*/

cmd.on('example',['test-bot'],['example-list'],(req,res) => {
  return res.client.reply(req,'Hello There!')
},{usedPrefix:true});

/*
Here I Describe
~~~~~~~~~~~~
When string On Message starts with prefix 
and Message after prefix test-bot, example Message "ztest-bot"
z is the prefix and the cokmand test-bot, when received bot reply Hello There
*/