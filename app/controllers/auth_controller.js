var Passport = require("../../models/passport.js");
var bcrypt = require("bcrypt-nodejs");

exports.pass = function(brother, passphrase, cb) {
    Passport.find(brother, function(err, passport) {
        if (err) {
            return cb(err);
        }
        bcrypt.hash(passphrase, passport.salt, function(err, hash) {
            if (err) {
                return cb(err);
            }
            if (hash === passport.pass) {
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        });
    });
};

exports.error = function(req, res) {
    res.render('404', {
        title: "Error: Page not Found"
    });
};