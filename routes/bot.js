var express = require('express');
var router = express.Router();
var searchService = require('../services/SearchService');
var searchOrderBot = require('../bot/SearchOrderBot');

var fbId = 100007310385437;
var fbToken = 'CAAGm0PX4ZCpsBAMZBMZCj7lzdbIiWDhgDUHQpqL6fQskXxdZCSVxH9ZAe9ilv0JqCedWb41nKwoQ7Ri4wjdSOUH09VQ19lmb3tyC9mfV6l3i1pSGWuGBoWkLYgSAQylFBUrdWFc0ZBcnmp7EKI84Xg6nhSDiI9kyx3bZBLopq7lQTQ14uaPxPwLjR1p9sb8EXe2tA8kSZBI76nvVgGOxvvioldNeVO1swo0ZD';


router.get('/bot', function(req, res) {
    searchService.getSearchOrderById(13)
    .then(function(searchOrder){
        res.render('bot', { searchOrders: [searchOrder] });
    });
});

router.get('/bot/createOrder', function(req, res) {
    req.
    searchService.createSearchOrder(
        { 
            facebookAccountId: fbId, 
            matchCriteria: {
                
            }
        })
    .then(function(error, order){
        console.log(error);
        console.log(order);
    });
    res.end();
});

// router.get('/bot/run', function(req, res) {

// });

module.exports = router;

