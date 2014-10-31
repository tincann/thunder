var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/login');
var status = require('./routes/status');
var bot = require('./routes/bot');
var filters = require('./routes/filters');
var pickuplines = require('./routes/pickuplines');

var app = express();

// Sessies aanzetten.
app.use(session({secret: '###WeAreThunderCommittedToGettingYouLaid###'}));

//mongodb integratie
var thunderdb = require('./thunder-db');
app.use(function(req, res, next){
    req.db = thunderdb.database;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(index); // Default route.
app.use('/login',login); // Handles login events
app.use('/status',status); // Shows status of running request
app.use('/filters',filters); // View with filters for match
app.use('/pickuplines',pickuplines); // View with pick up lines
app.use(bot);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

process.on('uncaughtException', function(error){
    console.log('FacebookToken expired (probably)', error);
});

module.exports = app;

