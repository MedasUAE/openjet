const server = require('./lib/server');

//init
const app = {}

//init defination
app.init = function(){
    server.init();
}

app.init();