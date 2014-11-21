var pass = require("../../repos/pass");
var bcrypt = require("bcrypt");

exports.pass = function(brother, passphrase, cb) {
    pass.findByBrother(brother, function(err, passport) {
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