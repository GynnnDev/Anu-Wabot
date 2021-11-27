global.botinfo = require('./src/json/botInfo.json');
global.clients = [];

new (require('./lib/functions.js'))().run();
