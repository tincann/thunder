var searchService = require('../services/SearchService');
var express = require('express');
var router = express.Router();

/* Toont de statuspagina. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    // Heeft deze user wel searchorders en is er minimaal één afgerond?
    searchService.getAllSearchOrdersByFaceBookId(req.session.user.fbid).then( function (searchorders) {
            if (!searchorders || searchorders.length == 0) {
                // Geen searchorders voor deze ID, doorverwijzen naar de filters om er een aan te maken.
                req.session.last_error = "";
                res.redirect('/filters');
            } else {
                console.log('searchorders');
                console.log(searchorders);
                // Is er minimaal één afgerond?
                var completed_searchorder = false;
                searchorders.forEach(function (el) {
                    if (el.MatchCriteria.complete == 1) { completed_searchorder = true;}
                });

                if (!completed_searchorder) {
                    // Geen afgeronde searchorder, door naar het filterscherm.
                    req.session.last_error = "";
                    res.redirect('/filters');
                } else {
                    // Toon statusoverzicht
                    // TODO
                    res.render('status', { session: req.session });
                }

            }
        }
    ).fail(function (error) {
            req.session.last_error('Fout bij ophalen searchorders: ' + error.message);
            res.render('status', { session: req.session });
        });

});

module.exports = router;
