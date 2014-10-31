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

    // Haal de eerste search order op voor dit account die momenteel nog aangemaakt wordt.
    searchService.getPendingSearchOrderByFaceBookId(req.session.user.fbid).then(function(existing_order) {
            if (existing_order) {
                // Params uit de search order uit de record halen.
                // TODO - testen.
                console.log(existing_order);

                res.render('filters', {searchorder_id: existing_order._id,
                    gender: existing_order.MatchCriteria.Gender,
                    age_min: existing_order.MatchCriteria.Age.min,
                    age_max: existing_order.MatchCriteria.Age.max,
                    location_lat: existing_order.MatchCriteria.Location.lat,
                    location_long: existing_order.MatchCriteria.Location.long,
                    range: existing_order.MatchCriteria.range,
                    session: req.session});
            } else {
                // Geen openstaande order, gewoon leeg scherm laten zien.
                res.render('filters', {session: req.session});
            }
        }
    );
});

/* Opslaan ingevulde waarden. */
router.post('/', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        res.redirect('/login');
    }

    // Checken parameters, indien niet goed, renderen met de waarden ingevuld.
    // TODO - testen
    var gender = req.param('gender');
    var age_min = parseInt(req.param('age_min'), 10);
    var age_max = parseInt(req.param('age_max'), 10);
    var location_lat = req.param('location_lat');
    var location_long = req.param('location_long');
    var range = req.param('range');
    var searchorder_id = req.param('searchorder_id');

    var validation_errors = [];
    if (!gender || (gender != 'm' && gender != 'v' && gender != 'b') ) {
        validation_errors.push("<li>Het opgegeven geslacht is ongeldig.</li>");
    }
    if (isNaN(age_min) || age_min < 0) {
        validation_errors.push("<li>De opgegeven minimum leeftijd is ongeldig.</li>");
    }
    if (isNaN(age_max) || age_max < 0) {
        validation_errors.push("<li>De opgegeven minimum leeftijd is ongeldig.</li>");
    }
    if (age_min >= age_max) {
        validation_errors.push("<li>De minimum leeftijd moet lager liggen dan de maximum leeftijd.</li>");
    }
    // TODO - location
    if (isNaN(range) || range < 0) {
        validation_errors.push("<li>Het opgegeven bereik is ongeldig.</li>");
    }

    if (searchorder_id) {
        searchService.getSearchOrderById(searchorder_id).then(function (searchorder) {
                if (!searchorder) {
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
                        location_long: location_long,
                        range: range,
                        session: req.session});
                }

                if (searchorder) {
                    // Bestaande searchorder aanpassen.
                    var match_crit = new MatchCriteria(gender, age_min, age_max, location_lat, location_long, range, searchorder.complete);

                    searchService.updateSearchOrder( {
                        facebookAccountId: req.session.user.fbid,
                        matchCriteria: match_crit,
                        pickupLines: null
                    }).then(function (error, result) {
                        if (error) {
                            // Fout melden.
                            req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                            res.render('filters', {
                                searchorder_id: searchorder.searchorder_id,
                                gender: gender,
                                age_min: age_min,
                                age_max: age_max,
                                location_lat: location_lat,
                                location_long: location_long,
                                range: range,
                                session: req.session});
                        } else {
                            // Updaten succesvol, doorverwijzen naar de volgende pagina.
                            req.session.last_error = '';
                            res.redirect('/pickuplines');
                        }
                    });
                } else {
                    // Nieuwe searchorder aanmaken.
                    var match_crit = new MatchCriteria(gender, age_min, age_max, location_lat, location_long, range, 0);

                    searchService.createSearchOrder( {
                        facebookAccountId: req.session.user.fbid,
                        matchCriteria: match_crit,
                        pickupLines: null
                    }).then(function (error, order) {
                        if (error) {
                            // Fout melden.
                            req.session.last_error = 'Er is een fout opgetreden bij het opslaan van de invoer: ' + error.message;
                            res.render('filters', {
                                gender: gender,
                                age_min: age_min,
                                age_max: age_max,
                                location_lat: location_lat,
                                location_long: location_long,
                                range: range,
                                session: req.session});
                        } else {
                            // Opslaan succesvol, doorverwijzen naar de volgende pagina.
                            req.session.last_error = '';
                            res.redirect('/pickuplines');
                        }
                    });
                }
            }
        );
    }
});

/* Verwijderen openstaande search order. */
router.get('/delete', function(req, res) {
    // Als search order pending is, dan verwijderen.
    // Daarna doorverwijzen naar status scherm.
    // TODO.
})

module.exports = router;
