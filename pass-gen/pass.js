var db = require("../mongodb");
var bcrypt = require("bcrypt");

// node pass-gen/pass passCreate
passCreate = function (name, passphrase) {
    db.init(function (err, cb) {
        if (err) {
            console.error("FATAL ERROR INIT:");
            console.error(err);
            return process.exit(-1);
        } else {
            (function hashGen() {
                var passport = {};
                passport.name = name;
                bcrypt.genSalt(12, function (err, salt) {
                    if (err) throw err;
                    passport.salt = salt;
                    bcrypt.hash(passphrase, salt, function (err, hash) {
                        if (err) {
                            return cb(err);
                        }
                        passport.pass = hash;
                        db.passport.insert(passport, {
                            w: 0,
                            safe: true
                        }, function (err, result) {
                            if (err) {
                                return cb(err);
                            }
                            return cb(null, null);
                        });
                    });
                });
            })();
        }
    });
}

var args = process.argv.slice(2, 5);
console.log(args[0]+ ", "+ args[1]+ ", "+ args[2]);

if (args[0] === "passCreate") {
    passCreate(args[1], args[2]);
}