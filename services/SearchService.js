var db = require('../thunder-db').database;
var q = require('q');
var SearchOrder = require('../models/SearchOrder');
var SearchOrderBot = require('../bot/SearchOrderBot');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();

    db.SearchOrders.findById(id , function(err, searchOrder){
        if(!err && searchOrder){
            defered.resolve(MapSearchOrder(searchOrder));
        }else{
            defered.resolve(null);
        }
    });

    return defered.promise;
};

SearchService.prototype.getAllSearchOrdersByFaceBookId = function(fbid) {
    var defered = q.defer();
    db.SearchOrders.find({FacebookAccountId: fbid}).toArray( function(err, searchOrders){
        if(err) {
            defered.reject(err);
        } else if(!searchOrders || searchOrders.length == 0){
            defered.resolve(null);
        }else{
            defered.resolve(MapSearchOrders(searchOrders));
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

SearchService.prototype.getRunningSearchOrders = function() {
    var defered = q.defer();
    db.SearchOrders.find({ Status: 'running' }).toArray(function(error, searchOrders){
        if(error){
            defered.reject(error);
        }else{
            defered.resolve(searchOrders);
        }
    });
    return defered.promise;
};

SearchService.prototype.getCompletedSearchOrders = function() {
    var defered = q.defer();
    db.SearchOrders.find({ Status: 'completed'}).toArray(function(error, searchOrders){
        if(error){
            console.log(error);
            defered.reject(error);
        }else{
            console.log(searchOrders);
            defered.resolve(MapSearchOrders(searchOrders));
        }
    });
    return defered.promise;
};

SearchService.prototype.getFirstReadySearchOrder = function() {
    var defered = q.defer();
    db.SearchOrders.findOne({ Status: 'waiting', 'MatchCriteria.Complete': 1 }, function(error, result){
        if(error){
            defered.reject(error);
        }else if(result){
            defered.resolve(MapSearchOrder(result));
        }else{
            defered.reject('no ready search order');
        }
    });
    return defered.promise;
};

SearchService.prototype.updateSearchOrderStatus = function(id, status) {
    var defered = q.defer();
    db.SearchOrders.update({ _id: id}, { $set: { Status: status } }, function(error, searchOrder){
        if(error){
            defered.reject(error);
        }else{
            defered.resolve(searchOrder);
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

SearchService.prototype.updateSearchOrder = function(id, properties){
    console.log('updating search order');
    var defered = q.defer();

    var searchOrder = new SearchOrder(
        properties.facebookAccountId,
        properties.matchCriteria,
        properties.pickupLines,
        properties.sampleSize);

    db.SearchOrders.updateById(id, {$set: searchOrder }, function(error, result){
        if(!error){
            console.log('order inserted in db', result);
            defered.resolve(result);
        }else{
            console.log('searchorder update failed:', error);
            defered.reject(error);
        }
    });

    return defered.promise;
};

SearchService.prototype.completeSearchOrder = function(orderId) {
    var defered = q.defer();
    console.log('completing search order:', orderId);
    db.SearchOrders.update({_id: orderId}, { $set: { Status: 'completed'} }, function(error, searchOrder){
        if(error){
            console.log('can\'t complete order:', error);
            defered.reject(error);
        }else{
            console.log(searchOrder);
            defered.resolve(searchOrder);
        }
    });

    return defered.promise;
}

SearchService.prototype.updateRunningSearchOrder = function(new_searchOrder){
    console.log('updating running searchorder');
    var defered = q.defer();

    db.SearchOrders.updateById(new_searchOrder._id, {$set: new_searchOrder }, function(error, result){
        if(!error){
            console.log('Running searchorder updated', result);
            defered.resolve(result);
        }else{
            console.log('Running searchorder update failed', error);
            defered.reject(error);
        }
    });

    return defered.promise;
};

function MapSearchOrder(searchOrder){
    searchOrder.__proto__ = SearchOrder.prototype;
    return searchOrder;
}

function MapSearchOrders(searchOrders){
    return searchOrders.map(function(el) { el.__proto__ = SearchOrder.prototype; return el;});
}

module.exports = new SearchService();
