var express = require('express');
var router = express.Router();

/* Edit scherm tonen. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    // Ophalen search, vullen params en teruggeven.

    res.render('filters', {session: req.session});
});

/* Opslaan ingevulde waarden. */
router.post('/', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    // Checken parameters, indien niet goed, renderen met de waarden.
    // TODO

    // Opslaan nieuwe search, doorverwijzen naar de volgende pagina.


});

module.exports = router;
