var express = require('express');
var path = require('path');
var config = require('./config.json');

var app = express();

var exphbs = require('express-handlebars');
var hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// log
app.use(require('morgan')('dev'));
// route for static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

var routes = require('./routes/index');
var admin = require('./routes/admin');

app.use('/', routes);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {

	var status = err.status || 500;

    res.status(status).render('error', {
    	status: status,
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || config.port || 3000;

app.listen(port, function() {

	console.log("Express server listening on port " + 3000);
});
