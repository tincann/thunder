var express = require('express');
var router = express.Router();

/* View met alle filters voor de match */
router.get('/', function (req, res) {
    res.render('filters');
});

module.exports = router;
