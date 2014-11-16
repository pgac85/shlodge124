var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require("http");
var path = require("path");
var fs = require('fs');
var routes = require('./application/routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/application/ui/'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, '/application/ui/')));
app.use(express.static(path.join(__dirname, '/application/ui/')));

app.use('/', routes);
app.use('/history/pdf', express.static(__dirname + '/application/ui/pdf/'));
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
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (process.mainModule === module) {
    http.createServer(app).listen(port, ip, function() {
        console.log("Express server listening on port"+port);
    });
}

module.exports = app;