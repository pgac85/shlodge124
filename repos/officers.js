var db = require('../mongodb');
var bson = require('mongodb').BSONPure;
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

exports.findByLodge = function(lodge, cb) {
	db.officers.find({lodge:lodge}).toArray(function(err, officers) {
		if (err) {
			return cb(err);
		}
		if (officers.length === 0) {
			return cb(null, []);
		} else if (officers.length > 0) {
			return cb(null, officers);
		}
	});
};

exports.updateNames = function(id, title, names, cb) {
	if (isValid(id)) {
		docId = new bson.ObjectID(id)
	} else {
		console.error("Invalid Application Id Entered");
		return cb(null);
	};
	db.officers.update({
		_id: docId
	}, {
		$set: {
			title: title,
			"chairs.0.name": names[0],
			"chairs.1.name": names[1],
			"chairs.2.name": names[2],
			"chairs.3.name": names[3],
			"chairs.4.name": names[4],
			"chairs.5.name": names[5],
			"chairs.6.name": names[6],
			"chairs.7.name": names[7],
			"chairs.8.name": names[8],
			"chairs.9.name": names[9],
			"chairs.10.name": names[10]
		}},{
		safe: true
	}, function(err, results) {
		if (err) {
			return cb(err);
		}
		return cb(null, results);
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
