var db = require('../thunder-db').database;
var q = require('q');
var SearchOrder = require('../models/SearchOrder');
var SearchOrderBot = require('../bot/SearchOrderBot');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();
    db.SearchOrders.findOne({_id: id}, function(err, searchOrder){
        if(!err && searchOrder){
            defered.resolve(MapSearchOrder(searchOrder));
        }else{
            defered.resolve(null);
        }
    });

    return defered.promise;
};

SearchService.prototype.getPendingSearchOrderByFaceBookId = function(fbid) {
    var defered = q.defer();
    db.SearchOrders.findOne({FacebookAccountId: fbid, 'MatchCriteria.Complete': 0}, function(err, searchOrder){
        if(!err && searchOrder){
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
            SearchOrderBot.addOrder(MapSearchOrder(order));
        }else{
            console.log(error);
        }
        defered.resolve(error, order);
    });
    return defered.promise;
};

SearchService.prototype.updateSearchOrder = function(id, properties){
    console.log('updating search order');
    var defered = q.defer();
    var searchOrder = new SearchOrder(
        properties.facebookAccountId,
        properties.matchCriteria,
        properties.pickupLines);

    db.SearchOrders.update({_id: id}, {$set: searchOrder }, function(error, result){

        if(!error){
            console.log('order inserted in db', result);
        }else{
            console.log(error);
        }
        defered.resolve(error, result);

    });
    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}

module.exports = new SearchService();
