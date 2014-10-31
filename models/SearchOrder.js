var db = require('../thunder-db').database;

function SearchOrder(facebookAccountId, matchCriteria){
    this.Status = 'idle';
    this.facebookaccountId = facebookaccountId;
    this.matchCriteria = matchCriteria;
    this.Created = +new Date();
}

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
