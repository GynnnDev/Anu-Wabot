global.botinfo = require('./src/json/botInfo.json');
global.clients = [];

new (require('./lib/function.js'))().run();
