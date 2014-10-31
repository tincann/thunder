var express = require('express');
var router = express.Router();
var searchService = require('../services/SearchService');

router.get('/bot', function(req, res) {
    searchService.getSearchOrderById(13)
    .then(function(searchOrder){
        res.render('bot', { searchOrders: [searchOrder] });
    });
});

router.get('/bot/create', function(req, res) {
    searchService.createSearchOrder(
        { FacebookId: 1337, FacebookToken: "abc"},
        "morten")
    .then(function(error, result){
        console.log(error);
        console.log(result);
    });
});



module.exports = router;
