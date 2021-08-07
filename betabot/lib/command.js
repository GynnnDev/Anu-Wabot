const util = require('util')
const catchResponse = require('../src/json/botInfo.json').response
class Command {
constructor(client, prefix) {
this._events = {}
this.default_prefix = /^z/
this.prefix = prefix
this.client = client
}

on(eventName, execCmd = [], usePrefix = true, callback = () => { }, _init = { }) {
console.log('[CMD]', `Re${this._events[eventName] ? ' - re' : ''}gister command ${eventName}`)
if (!this._events[eventName]) this._events[eventName] = {
eventName,
execCmd:new RegExp(`^${execCmd.join('|')}`,'i'),
usePrefix,
callback,
enabled: true,
..._init
}
else {
this._events[eventName] = {
...this._events[eventName],
execCmd: new RegExp(`^${execCmd.join('|')}`,'i'),
usePrefix,
callback,
..._init
}
}
}

modify(name = '', objectName = '', toValue = '') {
if (!this._events[name]) return this._events[name]
this._events[name][objectName] = toValue
return this._events[name]
}
}

module.exports = Command
