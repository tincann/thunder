var searchService = require('../services/SearchService');
var matchService = require('../services/MatchService');
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
            // Is er minimaal één afgerond?
            var completed_searchorder = false;
            searchorders.forEach(function (el) {
                if (el.MatchCriteria.complete == 1) { completed_searchorder = true;}
            });

            if (!completed_searchorder) {
                console.log('geen searchorders');
                // Geen afgeronde searchorder, door naar het filterscherm.
                req.session.last_error = "";
                res.redirect('/filters');
            } else {
                // Is er minimaal één afgerond?
                var completed_searchorder = false;
                searchorders.forEach(function (el) {
                    if (el.MatchCriteria.complete == 1) { completed_searchorder = true;}
                });

                // Toon statusoverzicht
                // TODO
                MatchService.getMatchesForFbId(req.session.user.fbid).then(function(matches){
                    res.render('status', { session: req.session, matches: matches });
                });
            }
        }
    }).fail(function (error) {
        req.session.last_error('Fout bij ophalen searchorders: ' + error.message);
        res.render('status', { session: req.session });
    });
});

module.exports = router;
