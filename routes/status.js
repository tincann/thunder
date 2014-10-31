var express = require('express');
var router = express.Router();

/* Toont de statuspagina. */
router.get('/', function (req, res) {
    res.send(req.session.fbid ? 'fbid: ' + req.session.fbid : 'No login found');
});

module.exports = router;
