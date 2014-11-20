var db = require('../mongodb');

exports.create = function(message, cb) {
    db.messages.insert(message, {
        w: 1,
        safe: true
    }, function(err, results) {
        if (err) {
            return cb(err);
        }
        return cb(null, null);
    });
};