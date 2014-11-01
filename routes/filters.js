var searchService = require('../services/SearchService');
var MatchCriteria = require('../models/MatchCriteria');

var express = require('express');
var router = express.Router();

/* Edit scherm tonen. */
router.get('/', function (req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
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
                res.render('filters', {searchorder_id: order_openstaand._id,
                    gender: order_openstaand.MatchCriteria.Gender ? order_openstaand.MatchCriteria.Gender : null,
                    age_min: order_openstaand.MatchCriteria.Age ? (order_openstaand.MatchCriteria.Age.min ? order_openstaand.MatchCriteria.Age.min : null) : null,
                    age_max: order_openstaand.MatchCriteria.Age ? (order_openstaand.MatchCriteria.Age.max ? order_openstaand.MatchCriteria.Age.max : null) : null,
                    location_lat: order_openstaand.MatchCriteria.Location ? (order_openstaand.MatchCriteria.Location.lat ? order_openstaand.MatchCriteria.Location.lat : null) : null,
                    location_lng: order_openstaand.MatchCriteria.Location ? (order_openstaand.MatchCriteria.Location.long ? order_openstaand.MatchCriteria.Location.long : null) : null,
                    range: order_openstaand.MatchCriteria.Range ? order_openstaand.MatchCriteria.Range : null,
                    session: req.session} );
            } else {
                // Wel orders, maar geen openstaande, dus we verwijzen door naar het status scherm.
                res.redirect('/status');
            }
        } else {
            // Geen orders, we laten een leeg scherm zien.
            res.render('filters', {session: req.session});
        }
    }).fail(function(error) {
        // TODO
        res.render('filters', {session: req.session});
    });
});

/* Opslaan ingevulde waarden. */
router.post('/', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    // Checken parameters en validatiefouten verzamelen.
    var gender = req.param('gender');
    var age_min = parseInt(req.param('age_min', 0), 10);
    var age_max = parseInt(req.param('age_max', 0), 10);
    var location_lat = parseFloat(req.param('location_lat', 0.0));
    var location_long = parseFloat(req.param('location_lng', 0.0));
    var range = parseInt(req.param('range',0), 10);
    var searchorder_id = req.param('searchorder_id', '');

    var validation_errors = [];
    if (!gender || (gender != 'm' && gender != 'v' && gender != 'b') ) {
        validation_errors.push("<li>Het opgegeven geslacht is ongeldig.</li>");
    }
    if (isNaN(age_min) || age_min < 0) {
        validation_errors.push("<li>De opgegeven minimum leeftijd is ongeldig.</li>");
    }
    if (isNaN(age_max) || age_max <= 0) {
        validation_errors.push("<li>De opgegeven maximum leeftijd is ongeldig.</li>");
    }
    if (age_min >= age_max) {
        validation_errors.push("<li>De minimum leeftijd moet lager liggen dan de maximum leeftijd.</li>");
    }
    if (isNaN(location_lat)) {
        validation_errors.push("<li>De opgegeven location_lat is ongeldig.</li>");
    }
    if (isNaN(location_long)) {
        validation_errors.push("<li>De opgegeven location_lng is ongeldig.</li>");
    }
    if (isNaN(range) || range <= 0) {
        validation_errors.push("<li>Het opgegeven bereik is ongeldig.</li>");
    }

    // Nu ophalen eventuele meegegeven searchorder.
    searchService.getSearchOrderById(searchorder_id).then(function (searchorder) {
            if (searchorder_id && !searchorder) {
                validation_errors.push("<li>De bestaande searchorder is ongeldig.</li>");
            }

            if (validation_errors.length > 0 ) {
                req.session.last_error = 'Er zijn fouten opgetreden in de invoer: <ul>' + validation_errors.join('') + '</ul>';
                res.render('filters', {
                    searchorder_id: searchorder ? searchorder.searchorder_id : null,
                    gender: gender,
                    age_min: age_min,
                    age_max: age_max,
                    location_lat: location_lat,
                    location_lng: location_long,
                    range: range,
                    session: req.session});
                res.end();
                return;
            }

            if (searchorder) {
                // Bestaande searchorder aanpassen.
                var match_crit = new MatchCriteria(gender, age_min, age_max, location_lat, location_long, range, searchorder.MatchCriteria.Complete);

                searchService.updateSearchOrder( searchorder._id, {
                    facebookAccountId: req.session.user.fbid,
                    matchCriteria: match_crit,
                    pickupLines: searchorder.PickupLines,
                    sampleSize: searchorder.SampleSize
                }).then(function (result) {
                    // Updaten succesvol, doorverwijzen naar de volgende pagina.
                    req.session.last_error = '';
                    res.redirect('/pickuplines');
                }).fail(function (error) {
                    // Fout melden.
                    req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                    res.render('filters', {
                        searchorder_id: searchorder._id,
                        gender: gender,
                        age_min: age_min,
                        age_max: age_max,
                        location_lat: location_lat,
                        location_lng: location_long,
                        range: range,
                        session: req.session});
                    res.end();
                });
            } else {
                // Nieuwe searchorder aanmaken.
                var match_crit = new MatchCriteria(gender, age_min, age_max, location_lat, location_long, range, 0);

                 searchService.createSearchOrder( {
                    facebookAccountId: req.session.user.fbid,
                    matchCriteria: match_crit,
                    pickupLines: null,
                    sampleSize: 0
                }).then(function (order) {
                     // Opslaan succesvol, doorverwijzen naar de volgende pagina.
                     req.session.last_error = '';
                     res.redirect('/pickuplines');
                 }).fail( function (error) {
                     req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                     res.render('filters', {
                             gender: gender,
                             age_min: age_min,
                             age_max: age_max,
                             location_lat: location_lat,
                             location_lng: location_long,
                             range: range,
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
