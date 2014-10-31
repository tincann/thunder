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
        properties.pickupLines,
        properties.sampleSize);

    console.log(searchOrder);


    db.SearchOrders.insert(searchOrder, function(error, order){
        var mappedOrder;
        if(!error){
            order = order[0];
            console.log('order for', order.FacebookAccountId, 'inserted in db');

            mappedOrder = MapSearchOrder(order);
            console.log('mapped order', mappedOrder);
            SearchOrderBot.addOrder(mappedOrder);
        }else{
            console.log('error while adding searchorder:', error);
            defered.reject(error);
        }

        defered.resolve(mappedOrder);
    });
    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}


module.exports = new SearchService();
