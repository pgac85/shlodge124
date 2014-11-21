var db = require('../mongodb');


exports.findByType = function(type1, type2, cb) {
	var findType;
	if (type1) {
		findType = {type: {$ne: "Event"}};
	}
	if (type2) {
		findType = {type: "Event"};
	}
	db.messages.find(findType).limit(5).sort({postDate:-1}).toArray(function(err, lodgMsgs) {
		if (err) {
			return cb(err);
		}
		if (lodgMsgs.length === 0) {
			return cb(null, []);
		} else if (lodgMsgs.length > 0) {
			return cb(null, lodgMsgs);
		}
	});
};

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