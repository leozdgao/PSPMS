var express = require('express');
var app = express();

var path = require('path');

//get configuration
var config = require('./config.json');
app.set('port', process.env.PORT || 3000);

//set view engine
var exphbs = require('express-handlebars');
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//requrie middlewares
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
//var proxy = require('./routes/proxy');

app.use('/', routes);
//app.use('/proxy', proxy);

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

var debug = require('debug')('server');

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
