var db = require('../mongodb');
var bson = require('mongodb').BSONPure;
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

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

exports.findById = findById = function(msgId, cb) {
	if (isValid(msgId)) {
		msgId = new bson.ObjectID(msgId)
	} else {
		console.error("Invalid Application Id Entered");
		return cb(null);
	};
	db.messages.find({
		_id: msgId
	}).toArray(function(err, message) {
		if (err) {
			return cb(err);
		}
		if (message.length === 0) {
			return cb(null, null);
		} else if (message.length === 1) {
			return cb(null, message[0]);
		} else {
			console.error("More than one message with _id: " + _id);
			return cb(err);
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

exports.updateEvent = function(id, event, cb) {
	if (isValid(id)) {
		eventId = new bson.ObjectID(id)
	} else {
		console.error("Invalid Application Id Entered");
		return cb(null);
	}
	db.messages.update({
		_id: eventId
	}, {
		$set: event
	}, {
		safe: true
	}, function(err, results) {
		if (err) {
			return cb(err);
		}
		return cb(null, results);
	});
};

exports.delete = function(id, cb) {
	return findById(id, function(err, message) {
		if (err) {
			return cb(err);
		}
		if (message) {
			db.messages.remove(message, {
				w: 1,
				safe: true
			}, function(err, results) {
				if (err) {
					return cb(err);
				}
				return cb(null, null);
			});
		} else {
			return cb(-1, null);
		};
	});
};

isValid = function(id) {
	if (id != null && 'number' != typeof id && (id.length != 12 && id.length != 24)) {
		return false;
	} else {
		// Check specifically for hex correctness
		if (typeof id == 'string' && id.length == 24) return checkForHexRegExp.test(id);
		return true;
	}
};

exports.fullAddress = function(event) {
	var text;
	text = [event.address, event.city, event.state, event.zipCode].filter(function(val) {
		return val;
	}).join(", ");
	return text;
};
