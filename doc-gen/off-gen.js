var db = require("../mongodb");

// node doc-gen/off-gen officerCreate
officerCreate = function (title) {
	db.init(function (err, cb) {
		if (err) {
			console.error("FATAL ERROR INIT:");
			console.error(err);
			return process.exit(-1);
		} else {
			(function officerDoc() {
				var officers;
				officers = {};
				officers.lodge = "SHL124";
				officers.title = title;
				officers.chairs = chairs;
				db.officers.insert(officers, {
					w: 0,
					safe: true
				}, function (err, result) {
					if (err) {
	    				return cb(err);
					}
				return cb(null, null);
				});
			})();
		}
	});
};

var chairs = [{"title":"Worshipful Master", "name":""},
				{"title":"Senior Warden", "name":""},
				{"title":"Junior Warden", "name":""},
				{"title":"Treasurer", "name":""},
				{"title":"Secretary", "name":""},
				{"title":"Chaplain", "name":""},
				{"title":"Senior Deacon", "name":""},
				{"title":"Junior Deacon", "name":""},
				{"title":"Senior Steward", "name":""},
				{"title":"Junior Steward", "name":""},
				{"title":"Tiler", "name":""}
				];
var args = process.argv.slice(2);
console.log(args[0]+ ", "+ args[1]);

if (args[0] === "officerCreate") {
    officerCreate(args[1]);
}