/* Vangt routes af die te maken hebben met het loginscherm. */
var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', { test: 'loginController' });
});

module.exports = router;


/*
 router.get('/', function(req, res) {
 req.db.FacebookAccounts.find().toArray(function(err, items){
 console.log(items);
 res.render('index', { title: 'test', items: items});
 });
 });*/