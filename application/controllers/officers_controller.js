var officers = require("../../repos/officers");
var auth = require('./auth_controller');

exports.officers = function(req, res) {
	var lodge;
	lodge = "SHL124";
	officers.findByLodge(lodge, function(err, officerDoc) {
		res.render('officers', {
			title: 'Spring Hill Masonic Lodge',
			officers: officerDoc,
			menuItem: "officers"
		});
	});
};

exports.update = function(req, res) {
	var brother, passphrase, id, title, names;
	brother = req.body.brother;
	passphrase = req.body.passphrase;
	id = req.body.id;
	title = req.body.title;
	names = req.body.name;
	auth.pass(brother, passphrase, function(err, pass) {
		if (pass === true) {
			officers.updateNames(id, title, names, function (err, results) {
				if (err) {
					req.session.errMessages = ["Unable to update Officers!"];
				} else {
					req.session.messages = ["Officers updated."];
				}
				res.redirect("/officers/");
			});
		} else {
			req.session.errMessages = ["Incorrect Password!"];
			return res.redirect("/officers/");
		}
	});
};