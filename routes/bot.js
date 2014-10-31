var express = require('express');
var router = express.Router();
var searchService = require('../services/SearchService');
var searchOrderBot = require('../bot/SearchOrderBot');

var fbId = 100007310385437;
var fbToken = 'CAAGm0PX4ZCpsBADFADZAxoRWxQnjb29MZC839qRXVa1jLbM8qazfhmMb4Ml8UZALXKpuJPDTXNab8evlMoN5NsUAKmHprJGt4aSDfm9N8wYDl0sU4y4RKZCTp9hGYIvDMYlDjuBjT8AXKm59BrpkWfqqYn1szpwieQlMU7ZAnEqsy3r5dAUL8BTP6p6zRujy3v6Mr9uZCV5ycksplq5QCdncwT4FxGZAKwgZD';


router.get('/bot', function(req, res) {
    searchService.getSearchOrderById(13)
    .then(function(searchOrder){
        res.render('bot', { searchOrders: [searchOrder] });
    });
});

router.get('/bot/createOrder', function(req, res) {
    //facebook id
    var fid = parseInt(req.param('fid'));
    //match criteria
    // var matchCriteria = new MatchCriteria(... ...);
    var sampleSize = parseInt(req.param('sampleSize'));

    searchService.createSearchOrder(
        { 
            facebookAccountId: fbId, 
            matchCriteria: { },//todo hier matchcriteria meegeven
            sampleSize: sampleSize
        })
    .then(function(order){
        console.log('inserted order:', order);
    })
    .fail(function(error){
        console.log("Error creating searchorder:", error);
    });
    res.end();
});

// router.get('/bot/run', function(req, res) {

// });

module.exports = router;

