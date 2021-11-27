const { exec,execSync,spawn } = require('child_process');
const Functions = require('./lib/functions.js');
const Command = require('./lib/command.js');
const WAConnection = require('./lib/waconnection.js');

global.baileys = require('@adiwajshing/baileys');
global.botinfo = require('./src/json/botInfo.json');
global.functions = new Functions();
global.client = new WAConnection();
global.cmd = new Command(client, botinfo, functions);
global.logo = []
global.clients = [];
global.used_logo = 0

functions.run(client);
