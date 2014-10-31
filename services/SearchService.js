var db = require('../thunder-db').database;
var q = require('q');
var SearchOrder = require('../models/SearchOrder');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();
    db.SearchOrders.findOne({SearchOrderId: id}, function(err, searchOrder){
        defered.resolve(MapSearchOrder(searchOrder));
    });
    return defered.promise;
};

SearchService.prototype.createSearchOrder = function(credentials, initiator){
    var defered = q.defer();
    var searchOrder = new SearchOrder(credentials, initiator);
    db.SearchOrders.insert(searchOrder, function(error, result){
        console.log(error);
        console.log(result);
    });
    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}


module.exports = new SearchService();
