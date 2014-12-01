var db = require("../mongodb");

// node doc-gen/oauthClient clientCreate
clientCreate = function (client, secret, redirect) {
    db.init(function (err, cb) {
        if (err) {
            console.error("FATAL ERROR INIT:");
            console.error(err);
            return process.exit(-1);
        } else {
            (function clientDoc() {
            	var oauthClient = {};
            	oauthClient.name = "SHLodge124";
            	oauthClient.client = client;
            	oauthClient.secret = secret;
            	oauthClient.redirect = redirect;
            	db.passport.insert(oauthClient, {
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

var args = process.argv.slice(2, 6);
console.log(args[0]+ ", "+ args[1]+ ", "+ args[2]+ ", "+ args[3]);

if (args[0] === "clientCreate") {
    clientCreate(args[1], args[2], args[3]);
}