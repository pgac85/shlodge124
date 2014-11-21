var express = require('express');
var http = require("http");
var path = require("path");
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongodb = require("./mongodb.js");
var application = require('./application');
var app = express();

// view engine setup
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("567db43d7bdf54ad1f6t-eb37248fcd0-71b6-11e443752fa9d3eaf5b2d43559308ed-fa92377c3974c800200c9a6"));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '7248fCD071b611A4D82f80800200CR866'
}));

app.use(function(req, res, next) {
    res.locals.errMessages = req.session.errMessages;
    delete req.session.errMessages;
    res.locals.messages = req.session.messages;
    delete req.session.messages;
    return next();
});

app.use(application);

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

mongodb.init(function (err) {
    if (err) {
        console.error("FATAL ERROR INIT:");
        console.error(err);
        return process.exit(-1);
    }
});

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP;

if (process.mainModule === module) {
    if (process.env.NODE_ENV === "production") {
        http.createServer(app).listen(port, ip, function () {
            console.log("Express server listening on port " + port);
        });
    } else {
        http.createServer(app).listen(3000, function() {
            console.log("Express server listening on port 3000");
        });
    }
}

module.exports = app;