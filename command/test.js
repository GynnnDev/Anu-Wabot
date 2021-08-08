cmd.on('test', ['test'],true, async (req, res) => {
res.client.reply(req,functions.util.format({req,res}))
})
