var express = require('express');
var app = express();

var path = require('path');

//set view engine
var exphbs = require('express-handlebars');
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// use logger
app.use(require('morgan')('dev'));
// set static file server
app.use(express.static(path.join(__dirname, 'public')));

// proxy
var config = require('./config.json');
if(config.proxy) app.use(require('./routes/proxy'));

// routers
app.use('/', function(req, res) { res.render('index', { title: 'PSPMS' }); });
app.use('/user', require('./routes/user'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	title: 'Error in PSPMS',
        error: err,
        layout: 'noscript'
    });
});

// var debug = require('debug')('server');
var mongoose = require('mongoose');

mongoose.connect('mongodb://10.10.73.207:27017, 10.10.73.208:27017/PSPMS_Dev?replicaSet=pspms', function() {

    var server = app.listen(process.env.PORT || 3000, function() {
        console.log('Express server listening on port ' + server.address().port);
    });    
});


