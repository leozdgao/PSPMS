var connect = require("connect");
var app = connect();

var path = require('path');

// use logger
app.use(require('morgan')('dev'));
// set static file server
app.use(require('serve-static')(path.join(__dirname, 'assets')));
// app.use(express.static());

// proxy
var config = require('./config.json');
if(config.proxy) app.use(require('./routes/proxy'));

// routers
app.use('/', require('./routes/index'));


var server = app.listen(process.env.PORT || config.port || 3000, function() {
    console.log('Express server listening on port ' + server.address().port);
});
