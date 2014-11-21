var officers = require("../../repos/officers");

exports.officers = function(req, res) {
    res.render('officers', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "officers"
    });
};