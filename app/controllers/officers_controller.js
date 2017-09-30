var Officers = require("../../models/officer.js");
var auth = require('./auth_controller');

exports.officers = function(req, res) {
  var lodge;
  lodge = "SHL124";
  Officers.find({lodge: lodge}, function(err, officerDoc) {
    if (err) return cb(err)
    res.render('officers/index', {
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
      Officers.update(id, title, names, function (err, results) {
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