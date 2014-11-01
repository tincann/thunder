var searchService = require('../services/SearchService');
var matchService = require('../services/MatchService');
var express = require('express');
var router = express.Router();

/* Toont de statuspagina. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        req.session.last_error = "";
        res.redirect('/login');
    }

    // Heeft deze user wel searchorders en is er minimaal één afgerond?
    searchService.getAllSearchOrdersByFaceBookId(req.session.user.fbid).then( function (searchorders) {
        if (!searchorders || searchorders.length == 0) {
            // Geen searchorders voor deze ID, doorverwijzen naar de filters om er een aan te maken.
            req.session.last_error = "";
            res.redirect('/filters');
        } else {
            // Zijn alle searchorders afgerond?
            var all_completed = true;
            searchorders.forEach(function (el) {
                if (el.MatchCriteria.Complete !== 1) { all_completed = false;}
            });

            if (!all_completed) {
                // Er is een openstaande searchorder, door naar het filterscherm.
                req.session.last_error = "";
                res.redirect('/filters');
            } else {
                // Alle searchorders afgerond, we kunnen het statusscherm tonen. We geven een lijst mee van
                //  searchorders.
                var orders = [];
                var genders = {'m': 'man', 'v': 'vrouw', 'b': 'bi'};
                searchorders.forEach(function (el) {
                    var desc = genders[el.MatchCriteria.Gender] + ' - ' + el.MatchCriteria.Age.min + ' tot ' +
                        el.MatchCriteria.Age.max + ' - ' + el.MatchCriteria.range + ' km van ' + el.MatchCriteria.City;
                    orders.push({id: el._id, val: desc});
                });

                req.session.last_error = "";
                res.render('status', { searchorders: orders, session: req.session});
            }
        }
    }).fail(function (error) {
        req.session.last_error('Fout bij ophalen searchorders: ' + error.message);
        res.render('status', { session: req.session });
    }).done();

});

module.exports = router;
