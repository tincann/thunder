var express = require('express');
var router = express.Router();

/* Toont de statuspagina. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    res.render('status', { session: req.session });
});

module.exports = router;
