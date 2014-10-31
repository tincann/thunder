var db = require('../thunder-db').database;
var q = require('q');
var SearchOrder = require('../models/SearchOrder');
var SearchOrderBot = require('../bot/SearchOrderBot');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();
    db.SearchOrders.findOne({SearchOrderId: id}, function(err, searchOrder){
        defered.resolve(MapSearchOrder(searchOrder));
    });
    return defered.promise;
};

SearchService.prototype.createSearchOrder = function(properties){
    console.log('creating search order');
    var defered = q.defer();
    var searchOrder = new SearchOrder(
        properties.facebookAccountId, 
        properties.matchCriteria, 
        properties.pickupLines);

    db.SearchOrders.insert(searchOrder, function(error, order){
        console.log(error);
        console.log('order inserted in db', order);
        SearchOrderBot.addOrder(order[0]);
    });
    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}


module.exports = new SearchService();
