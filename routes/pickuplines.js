var searchService = require('../services/SearchService');
var MatchCriteria = require('../models/MatchCriteria');
var express = require('express');
var router = express.Router();

/* Edit scherm tonen. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        req.session.last_error = "";
        res.redirect('/login');
    }

    // Heeft deze account orders?
    searchService.getAllSearchOrdersByFaceBookId(req.session.user.fbid).then(function(orders) {
        if (orders && orders.length > 0) {
            // Er zijn orders, zoek de eerste openstaande order.
            var order_openstaand = null;
            orders.every(function(el) {
                if (el.MatchCriteria.Complete == 0) {
                    order_openstaand = el; return false;
                } else {
                    return true;
                }
            });

            if (order_openstaand) {
                // Er is een openstaande order, we geven de params aan de front-end.
                res.render('pickuplines', {searchorder_id: order_openstaand._id,
                    pickup_1: order_openstaand.PickupLines[0] ? order_openstaand.PickupLines[0] : '',
                    pickup_2: order_openstaand.PickupLines[1] ? order_openstaand.PickupLines[1] : '',
                    pickup_3: order_openstaand.PickupLines[2] ? order_openstaand.PickupLines[2] : '',
                    samplesize: order_openstaand.SampleSize,
                    session: req.session});
            } else {
                // Wel orders, maar geen openstaande, dus we verwijzen door naar het status scherm.
                req.session.last_error = "";
                res.redirect('/status');
            }
        } else {
            // Geen orders, we laten een leeg scherm zien.
            res.render('pickuplines', {session: req.session});
        }
    }).fail(function(error) {
        // TODO
        res.render('pickuplines', {session: req.session});
    });
});

/* Opslaan ingevulde waarden. */
router.post('/', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.session.last_error = '';
        res.redirect('/login');
    }

    // Checken parameters en validatiefouten verzamelen.
    var pickup_1 = req.param('pickup_1');
    var pickup_2 = req.param('pickup_2');
    var pickup_3 = req.param('pickup_3');
    var samplesize = parseInt(req.param('samplesize',0), 10);
    var searchorder_id = req.param('searchorder_id', '');

    var validation_errors = [];
    if (!pickup_1 || pickup_1 === '' ) {
        validation_errors.push("<li>De eerste pick up line is niet ingevuld.</li>");
    }
    if (!pickup_2 || pickup_2 === '' ) {
        validation_errors.push("<li>De tweede pick up line is niet ingevuld.</li>");
    }
    if (!pickup_3 || pickup_3=== '' ) {
        validation_errors.push("<li>De derde pick up line is niet ingevuld.</li>");
    }
    if (isNaN(samplesize) || samplesize <= 0) {
        validation_errors.push("<li>De opgegeven samplesize is ongeldig.</li>");
    }

    // Nu ophalen eventuele meegegeven searchorder.
    searchService.getSearchOrderById(searchorder_id).then(function (searchorder) {
            if (searchorder_id && !searchorder) {
                validation_errors.push("<li>De bestaande searchorder is ongeldig.</li>");
            }

            if (validation_errors.length > 0 ) {
                req.session.last_error = 'Er zijn fouten opgetreden in de invoer: <ul>' + validation_errors.join('') + '</ul>';
                res.render('pickuplines', {
                    searchorder_id: searchorder ? searchorder.searchorder_id : null,
                    pickup_1: pickup_1,
                    pickup_2: pickup_2,
                    pickup_3: pickup_3,
                    samplesize: samplesize,
                    session: req.session});
                res.end();
                return;
            }

            if (searchorder) {
                // Zijn we nu compleet? TODO: dit kan echt beter.
                var match_crit = searchorder.MatchCriteria;
                var so_complete = false;
                if (match_crit.Gender && match_crit.Age && match_crit.Location && match_crit.Range) {
                    searchorder.MatchCriteria.Complete = 1;
                    so_complete = true;
                }
                // Bestaande searchorder aanpassen.
                searchService.updateSearchOrder( searchorder._id, {
                    facebookAccountId: req.session.user.fbid,
                    matchCriteria: searchorder.MatchCriteria,
                    pickupLines: [pickup_1, pickup_2, pickup_3],
                    sampleSize: samplesize
                }).then(function (result) {
                        // Opslaan succesvol, doorverwijzen naar de statuspagina of naar de filterspagina.
                        req.session.last_error = '';
                        if (so_complete) {
                            res.redirect('/status');
                        } else {
                            res.redirect('/filters');
                        }
                }).fail(function (error) {
                        // Fout melden.
                        req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                        res.render('pickuplines', {
                            searchorder_id: searchorder._id,
                            pickup_1: pickup_1,
                            pickup_2: pickup_2,
                            pickup_3: pickup_3,
                            samplesize: samplesize,
                            session: req.session});
                    }
                );
            } else {
                // Nieuwe searchorder aanmaken.
                searchService.createSearchOrder( {
                    facebookAccountId: req.session.user.fbid,
                    matchCriteria: {Complete: 0},
                    pickupLines: [pickup_1, pickup_2, pickup_3],
                    SampleSize: samplesize
                }).then(function (order) {
                    // Opslaan succesvol, doorverwijzen naar de filterspagina om de search order af te maken.
                    req.session.last_error = '';
                    res.redirect('/filters');
                }).fail( function (error) {
                    req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                    res.render('pickuplines', {
                        pickup_1: pickup_1,
                        pickup_2: pickup_2,
                        pickup_3: pickup_3,
                        samplesize: samplesize,
                        session: req.session});
                });
            }
        }
    );
});

/* Verwijderen openstaande search order. */
router.get('/delete', function(req, res) {
    // Als search order pending is, dan verwijderen.
    // Daarna doorverwijzen naar status scherm.
    // TODO.
})

module.exports = router;
