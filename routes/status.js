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
                        el.MatchCriteria.Age.max + ' - ' + el.MatchCriteria.Range + ' km van ' + el.MatchCriteria.City;
                    orders.push({order_id: el._id, val: desc});
                });

                req.session.last_error = "";
                res.render('status', { searchorders: orders, session: req.session});
            }
        }
    }).fail(function (error) {
        req.session.last_error = 'Fout bij ophalen searchorders: ' + error.message;
        res.render('status', { session: req.session });
    }).done();

});

router.get('/getMatchesList', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        req.session.last_error = "";
        res.status(403).end();
    }

    var order_id = req.param('id', '');
    var searchorder = searchService.getSearchOrderById(order_id).then(function (searchorder) {
        if (!searchorder) {
            // Ongeldige search order meegegeven.
            req.session.last_error = "";
            res.status(404).end();
        } else {
            // TODO - checken of dit wel een searchorder is van de ingelogde gebruiker.

            // Ophalen alle TinderMatches en response vullen.
            var match_list = [];

            searchorder.Matches.forEach(function(el) {
                var status = 'unknown';
                if (el.Success === true) {
                    status = 'success';
                } else if (el.Success === false) {
                    status = 'fail';
                } else if (el.Success === null) {
                    if (el.Response.length > 0) {
                        status = 'response';
                    } else if (el.Response.LikedBack === true) {
                        status = 'waiting';
                    }
                }

                var birth_date = new Date(el.UserInfo.birth_date);
                var age = ~~((Date.now() - birth_date) / (31557600000));

                match_list.push({match_id: el.UserInfo._id,
                    name: el.UserInfo.name,
                    bio: el.UserInfo.bio,
                    photo: el.UserInfo.photos[0].url,
                    gender: (el.UserInfo.gender == 1) ? 'v' : 'm',
                    age: age,
                    distance: el.UserInfo.distance_mi * 1.6,
                    status: status});
            });

            req.session.last_error = '';
            res.json(match_list);
        }
    }).done();
});


router.get('/getMatch', function(req, res) {
    // Zijn we wel ingelogd?
    if (!req.session.user) {
        req.session.last_error = "";
        res.status(403).end();
    }

    var order_id = req.param('order_id', '');
    var match_id = req.param('match_id', '');
    var searchorder = searchService.getSearchOrderById(order_id).then(function (searchorder) {
        if (!searchorder) {
            // Ongeldige searchorderid meegegeven.
            req.session.last_error = "";
            res.status(404).end();
        } else {
            // TODO - checken of dit wel een searchorder is van de ingelogde gebruiker.

            // Ophalen juiste match binnen de searchorder.
            var match = null;
            searchorder.Matches.every ( function (el) {
                if (el.UserInfo._id == match_id) {
                    match = el;
                    return false;
                }
                return true;
            });
            if (!match) {
                // Ongeldige matchid meegegeven.
                req.session.last_error = "";
                res.status(404).end();
            }

            // Checken of deze match wel een status 'response' heeft.
            // TODO - enablen.
            if (false /*match.Success !== null || match.Response.length == 0*/) {
                req.session.last_error = "";
                res.status(404).end();
            } else {
                // Teruggeven gegevens van deze match.
                var birth_date = new Date(match.UserInfo.birth_date);
                var age = ~~((Date.now() - birth_date) / (31557600000));

                req.session.last_error = '';
                res.json({match_id: match._id,
                    name: match.UserInfo.name,
                    bio: match.UserInfo.bio,
                    photo: match.UserInfo.photos[0].url,
                    gender: (match.UserInfo.gender == 1) ? 'v' : 'm',
                    age: age,
                    distance: match.UserInfo.distance_mi * 1.6,
                    responses: match.Response});
            }
        }
    }).done();

});

module.exports = router;
