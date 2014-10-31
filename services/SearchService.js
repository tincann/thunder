var db = require('../thunder-db').database;
var q = require('q');

function SearchService(){

}

SearchService.prototype.getSearchOrderById = function(id) {
    var defered = q.defer();
    db.SearchOrders.findOne({SearchOrderId: id}, function(err, result){
        console.log(result);
        defered.resolve(result);
    });
    return defered.promise;
};


module.exports = new SearchService();