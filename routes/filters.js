var express = require('express');
var router = express.Router();

/* Verwijst door naar de default pagina (login). */
router.get('/', function (req, res) {
    res.render('filters');
} );

module.exports = router;
