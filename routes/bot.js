var express = require('express');
var router = express.Router();
var searchService = require('../services/SearchService');

router.get('/bot', function(req, res) {
    searchService.getSearchOrderById(13)
    .then(function(searchOrder){
        res.render('bot', { searchOrders: [searchOrder] });
    });
});

module.exports = router;
