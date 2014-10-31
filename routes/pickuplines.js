var express = require('express');
var router = express.Router();

/* Pick up lines view */
router.get('/', function (req, res) {
    res.render('pickuplines');
});

module.exports = router;
