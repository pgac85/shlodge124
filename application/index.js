var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
// controllers
var auth_controller = require('./controllers/auth_controller');
var trestleboard_controller = require('./controllers/trestleboard_controller');
var officers_controller = require('./controllers/officers_controller');
var pages_controller = require('./controllers/pages_controller');


var app = module.exports = express();
app.set('views', path.join(__dirname + '/ui'));
app.use(require('stylus').middleware(path.join(__dirname + '/ui')));
app.use(express.static(path.join(__dirname, '/ui')));
app.use(favicon(path.join(__dirname + '/ui/images/favicon.ico')));
app.use('/history/pdf', express.static(__dirname + '/ui/pdf/'));

app.get("/news", trestleboard_controller.news);
app.delete("/news/:id", trestleboard_controller.destroy);
app.get("/news/:id", trestleboard_controller.show);
app.get("/post", trestleboard_controller.manager);
app.post("/post", trestleboard_controller.post);
app.get("/officers", officers_controller.officers);
app.put("/officers", officers_controller.update);
app.get("/", pages_controller.index);
app.get("/history", pages_controller.history);
app.get("/faq", pages_controller.faq);
app.get("/contact", pages_controller.contact);
app.get("/links", pages_controller.links);
app.get("/tour", pages_controller.tour);
app.get("/404", auth_controller.error);


