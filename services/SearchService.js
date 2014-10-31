var db = require('../thunder-db').database;
var q = require('q');
var SearchOrder = require('../models/SearchOrder');
var SearchOrderBot = require('../bot/SearchOrderBot');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();
    db.SearchOrders.findOne({_id: id}, function(error, searchOrder){
        if(!error){
            defered.resolve(MapSearchOrder(searchOrder));
        }else{
            defered.resolve(null);            
        }

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
        if(!error){
            console.log('order inserted in db', order);
            SearchOrderBot.addOrder(order[0]);
        }else{
            console.log(error);
        }
    });
    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}


module.exports = new SearchService();
