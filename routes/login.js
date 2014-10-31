/* Vangt routes af die te maken hebben met het loginscherm. */
var express = require('express');
var router = express.Router();

// Toont het loginscherm.
router.get('/', function(req, res) {
    // Zijn we ingelogd? Dan doorverwijzen naar status.
    // TODO

    // Anders ophalen alle accounts die we kennen en aan de view geven voor selectie van een view om mee te werken.
    req.db.FacebookAccounts.find({}, {Alias:1, FacebookId:1}).toArray(
        function (err, items) {
            res.render('login', { accounts: items ? items : [], session: req.session });
        }
    );
});

// Logt de huidige gebruiker uit.
router.get('/logout', function(req, res) {
    req.session.last_error = "";
    req.session.user = null;

    res.redirect('/');
});

// Selecteert een al bekende facebook id en verwijst door naar het statusscherm.
router.post('/select', function (req,res) {
    // Is de meegegeven id bekend?
    var selected_id = parseInt(req.param('fbid', 0), 10);
    var selected_account = req.db.FacebookAccounts.findOne({FacebookId: selected_id}, function (err, result) {
        if(result === null) {
            // Onbekende account -> terug naar loginpagina.
            req.session.last_error = "Het geselecteerde account is niet gevonden.";
            req.session.user = null;
            res.redirect('/login');
        } else {
            // Account gevonden: zetten login in de sessie en doorverwijzen status pagina.
            req.session.last_error = "";
            req.session.user = {fbid: selected_id, fbalias: result.Alias};
            res.redirect('/status');
        }
    });
 });

router.post('/create', function(req,res) {
     // Checken input
    var fbalias = req.param('newfbalias');
    var fbtoken = req.param('newfbtoken');
    var fbid = parseInt(req.param('newfbid'), 10);

    if (!fbalias || fbid == Number.NaN || fbid < 0 || !fbtoken) {
        // Input is ongeldig, terugsturen naar loginscherm.
        req.session.last_error = "De ingevoerde gegevens zijn ongeldig.";
        req.session.user = null;
        res.redirect('/login');
    } else {
        // Aanmaken nieuw account.
        req.db.FacebookAccounts.Insert( {FacebookId: fbid, FacebookToken: fbtoken, Alias: fbalias}, function(error, result){
            // Fout bij aanmaken account, terugsturen naar loginscherm.
            if (error) {
                req.session.last_error = "Er was een fout bij het aanmaken van het nieuwe account: " + error.message;
                req.session.user = null;
                res.redirect('/login');
            } else {
                // Zetten login in de sessie en doorverwijzen status pagina.
                req.session.last_error = "";
                req.session.user = {'fbid': fbid, 'fbalias': fbalias};
                res.redirect('/status');
            }
        });
    }
});

module.exports = router;
