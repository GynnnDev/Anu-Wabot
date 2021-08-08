
class Command {
constructor(client, botinfo, functions) {
this._events = {}
this.default_prefix = /^z/
this.prefix = new RegExp(`^${botinfo.prefix.join('|')}`)
this.client = client
this.functions = functions
this.botinfo = botinfo
}

on(eventName, command = [], usePrefix = true, callback = () => {}, opt = {}) {
let eventObj = Object.keys(this._events)
let nitip = !this._events[eventName] ? `Register Event|Command ${eventName}` : `Checking Event|Command ${eventName}`
this._events[eventName] = { eventName,command: new RegExp(`^${command.join('|')}`),usePrefix,callback,...opt,enable:true}
this.functions.logLoading(`${nitip}`)
}

modify(name = '', objectName = '', toValue = '') {
if (!this._events[name]) return this._events[name]
this._events[name][objectName] = toValue
return this._events[name]
}
exec(msg){
return new Promise(async(resolve,reject) => {
for (let eventCmd in this._events){
let event = this._events[eventCmd]
if (!event.enable) return
let prefix = !event.usedPrefix ? msg.command.exec(msg.StringMsg) : this.prefix.exec(msg.StringMsg) || this.default_prefix.exec(msg.StringMsg)
if (!prefix) return 
let total_args = msg.StringMsg.split(' ')
let args = total_args.slice(1)
let usedPref = prefix[0]
let command = !event.usedPrefix ? usedPref : msg.StringMsg.replace(usedPref,'')
let commandNpref = !this._events[eventCmd].usedPrefix ? command : usedPref + command
if (!command) return
let query = msg.StringMsg.replace(commandNpref,'')
let text = msg.StringMsg
let group = msg.isGroup? await msg.groupData() : false
let isOwner = msg.isOwner
}})
}
}

module.exports = Command;
