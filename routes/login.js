/* Vangt routes af die te maken hebben met het loginscherm. */
var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', { test: 'loginController' });
});

module.exports = router;