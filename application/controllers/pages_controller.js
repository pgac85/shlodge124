
exports.index = function(req, res) {
    res.render('index', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "home"
    });
};
exports.history = function(req, res) {
    res.render('history', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "history"
    });
};
exports.faq = function(req, res) {
    res.render('faq', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "faq"
    });
};
exports.contact = function(req, res) {
    res.render('contact', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "contact"
    });
};
exports.links = function(req, res) {
    res.render('links', {
        title: 'Spring Hill Masonic Lodge',
        menuItem: "links"
    });
};
exports.tour = function(req, res) {
    res.render('tour', {
        title: 'Spring Hill Masonic Lodge'
    });
};
