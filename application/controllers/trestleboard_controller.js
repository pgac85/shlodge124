var messages = require("../../repos/messages");
var auth = require('./auth_controller');

exports.news = function(req, res) {
    var type1, type2;
    type1 = "work";
    type2 = "event";
    messages.findByType(type1, null, function(err, msgs) {
        messages.findByType(null, type2, function(err, events) {
            res.render('news', {
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
            messages.create(message, function (err, results) {
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
        title: 'Spring Hill Masonic Lodge'
    });
};

exports.destroy = function(req, res) {
    var passphrase, brother;
    passphrase = req.body.passphrase;
    brother = req.body.name;
    auth.pass(brother, passphrase, function(err, pass) {
        if (pass === true) {
            messages.delete(req.params.id, function (err, message) {
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
    messages.findById(req.params.id, function(err, lodg_event) {
        if (!lodg_event) {
            res.redirect('/news/');
        } else {
            res.render('event', {
                title: 'Spring Hill Masonic Lodge',
                event: lodg_event,
                menuItem: "news"
            });
        };
    });
};