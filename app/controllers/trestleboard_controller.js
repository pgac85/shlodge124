var Message = require("../../models/message.js");
var auth = require('./auth_controller.js');
var helpers = require('../../lib/helper.js');

exports.news = function(req, res) {
    var type1, type2;
    type1 = {type: {$ne: "Event"}};
    type2 = {type: "Event"};
    Message.find(type1, function(err, msgs) {
        Message.find(type2, function(err, events) {
            res.render('news/index', {
                title: 'Spring Hill Masonic Lodge',
                msgs: msgs,
                events: events,
                menuItem: "news"
            });
        });
    });
};

exports.post = function(req, res) {
    var passphrase, brother, message;
    passphrase = req.body.passphrase;
    brother = req.body.name;
    auth.pass(brother, passphrase, function(err, pass) {
        if (pass === true) {
            delete req.body.passphrase;
            delete req.body.name;
            var msg, title;
            message = {};
            msg = req.body.message;
            title = req.body.title;
            if (msg) {
                message.msg = msg;
                message.type = req.body.type;
                message.date = req.body.date;
                message.postDate = new Date();
            }
            if (title) {
                message.title = title;
                message.details = req.body.details;
                message.address = req.body.address;
                message.city = req.body.city;
                message.zipCode = req.body.zipCode;
                message.type = req.body.type;
                message.date = req.body.date;
                message.postDate = new Date();
            }
            Message.insert(message, function (err, results) {
                if (err) throw err;
                req.session.messages = ["Post Successful!"];
                return res.redirect("/news/");
            });
        } else {
            req.session.errMessages = ["Incorrect Password!"];
            return res.redirect("/news/");
        }
    });
};

exports.manager = function(req, res) {
    res.render('post', {
        title: 'Spring Hill Masonic Lodge',
        states: helpers.statesForSelect()
    });
};

exports.destroy = function(req, res) {
    var passphrase, brother;
    passphrase = req.body.passphrase;
    brother = req.body.name;
    auth.pass(brother, passphrase, function(err, pass) {
        if (pass === true) {
            Message.remove(req.params.id, function (err, message) {
                if (err) {
                    req.session.errMessages = ["Unable to delete Message!"];
                } else {
                    req.session.messages = ["Message deleted!"];
                }
                res.redirect('/news/');
            });
        } else {
            req.session.errMessages = ["Incorrect Password!"];
            return res.redirect("/news/");
        }
    });
};
exports.show = function(req, res) {
    Message.findById(req.params.id, function(err, lodg_event) {
        if (!lodg_event) {
            res.redirect('/news/');
        } else {
            var fullAddress = helpers.fullAddress(lodg_event);
            res.render('event/index', {
                title: 'Spring Hill Masonic Lodge',
                fullAddress: fullAddress,
                states: helpers.statesForSelect(),
                event: lodg_event,
                menuItem: "news"
            });
        };
    });
};

exports.update = function(req, res) {
    var brother, passphrase, id, event;
    brother = req.body.brother;
    passphrase = req.body.passphrase;
    auth.pass(brother, passphrase, function(err, pass) {
        if (pass === true) {
            if (req.body.state === "-1") {
                delete req.body.state;
            }
            delete req.body.brother;
            delete req.body.passphrase;
            id = req.body.id;
            event = req.body;
            Message.update(id, event, function (err, results) {
                if (err) {
                    req.session.errMessages = ["Unable to update Event!"];
                } else {
                    req.session.messages = ["Event updated."];
                }
                res.redirect("/news/" + req.params.id);
            });
        } else {
            req.session.errMessages = ["Incorrect Password!"];
            return res.redirect("/news/" + req.params.id);
        }
    });
};
