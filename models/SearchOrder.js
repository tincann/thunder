var db = require('../thunder-db').database;

function SearchOrder(facebookAccountId, matchCriteria, pickupLines, sampleSize){
    //waiting, running, complete
    this.Status = 'waiting';
    this.FacebookAccountId = facebookAccountId;
    this.MatchCriteria = matchCriteria || {};
    this.PickupLines = pickupLines || [];
    this.SampleSize = sampleSize || 30;
    this.Created = +new Date();
    this.Matches = [];
}

SearchOrder.prototype.setClient = function(client) {
    this.client = client;
};

module.exports = SearchOrder;


// //get highest id -- RACECONDITIE #hack
// var currentId;
// db.SearchOrders.find({}, {
//     limit: 1,
//     sort: 
// }).sort({SearchOrderId: -1}).limit(1).toArray(function(err, searchOrder){
//     currentId = searchOrder.SearchOrderId;
// });

// function getNextId(){
//     console.log('last id:', currentId);
//     return ++currentId;
// }
