var express = require('express');
var router = express.Router();
var pass = require("../../repos/pass");
var messages = require("../../repos/messages");
var bcrypt = require("bcrypt");

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "home"
		});
});

router.get('/news', function(req, res) {
	res.render('news', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "news"
		});
});
router.post('/news', function(req, res, cb) {
	var passphrase, brother, message;
	passphrase = req.body.passphrase;
	brother = req.body.name;
	pass.findByBrother(brother, function(err, passport) {
		if (err) {
			return cb(err);
		}
		bcrypt.hash(passphrase, passport.salt, function(err, hash) {
			if (err) {
				return cb(err);
			}
			if (hash === passport.pass) {
				message = {};
				message.msg = req.body.message;
				message.type = req.body.post;
				messages.create(message, function (err, results) {
					if (err) throw err;
					return res.redirect("/news/");
				});
			}
		});
	});
});
router.get('/history', function(req, res) {
	res.render('history', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "history"
		});
});

router.get('/officers', function(req, res) {
	res.render('officers', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "officers"
		});
});

router.get('/faq', function(req, res) {
	res.render('faq', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "faq"
		});
});

router.get('/contact', function(req, res) {
	res.render('contact', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "contact"
		});
});
router.get('/links', function(req, res) {
	res.render('links', { 
		title: 'Spring Hill Masonic Lodge',
		menuItem: "links"
		});
});
router.get('/tour', function(req, res) {
	res.render('tour', {
		title: 'Spring Hill Masonic Lodge',
	});
});

module.exports = router;
