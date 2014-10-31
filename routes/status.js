var express = require('express');
var router = express.Router();

/* Toont de statuspagina. */
router.get('/', function (req, res) {
    res.send(req.session.user ? 'User: ' + req.session.user.fbid : 'No login found');
});

module.exports = router;
