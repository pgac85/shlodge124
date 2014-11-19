var db = require("../mongodb");
var bcrypt = require("bcrypt");

// node pass-gen/pass passCreate
passCreate = function () {
    db.init(function (err, cb) {
        if (err) {
            console.error("FATAL ERROR INIT:");
            console.error(err);
            return process.exit(-1);
        } else {
            (function hashGen() {
                var passport = {};
                bcrypt.genSalt(12, function (err, salt) {
                    if (err) throw err;
                    passport.salt = salt;
                    bcrypt.hash("sh!Bb0L3th", salt, function (err, hash) {
                        if (err) throw err;
                        passport.pass = hash;
                        db.passport.insert(passport, {
                            w: 0,
                            safe: true
                        }, function (err, newPass) {
                            if (err) {
                                return cb(err);
                            }
                            return cb(null, newPass);
                        });
                    });
                });
            })();
        }
    });
}

var args = process.argv.slice(2);
console.log(args[0] + ", " + args[1]);

if (args[0] === "passCreate") {
    passCreate();
}