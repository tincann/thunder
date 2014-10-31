var express = require('express');
var router = express.Router();

/* Pick up lines view */
router.get('/', function (req, res) {
    res.render('pickuplines', { session: req.session });
});

module.exports = router;
