var MongoClient = require("mongodb").MongoClient;


exports.init = function(onCreate) {
	var db, dbUrl, dbHost, dbPort, dbUser, dbPass;
	dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
	dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

	if (process.env.NODE_ENV === "production") {
		dbUrl = OPENSHIFT_MONGODB_DB_URL;
	} else {
		dbUrl = "mongodb://127.0.0.1:27017/shlodge124";
	}

	db = MongoClient.connect(dbUrl, function (err, db) {
		if (err) throw err;
		console.log("connected to the MongoDB!");
		exports.messages = db.collection("messages");
		exports.passport = db.collection("passport");
		return onCreate();
	});
};
