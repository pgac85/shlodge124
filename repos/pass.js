var db = require('../mongodb');

exports.findByBrother = function(name, cb) {
    db.passport.find({name:name}).toArray(function(err, brother) {
        if (err) return cb(err, null);
        if (brother.length === 0) {
            return cb(null, null);
        } else if (brother.length === 1) {
            return cb(null, brother[0]);
        }
    });
};

exports.findByClient = function(name, cb) {
    db.passport.find({name:name}).toArray(function(err, oClient) {
        if (err) return cb(err, null);
        if (oClient.length === 0) {
            return cb(null, null);
        } else if (oClient.length === 1) {
            return cb(null, oClient[0]);
        }
    });
};
