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
            message = {};
            message.msg = req.body.message;
            message.type = req.body.type;
            message.date = req.body.date;
            message.postDate = new Date();
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