var db = require('../thunder-db').database;
var TinderMatch = require('../models/TinderMatch');
var q = require('q');

function MatchService(){

}

MatchService.prototype.insertMatches = function(orderId, matches) {
    var defered = q.defer();
    console.log('inserting matches');
    db.SearchOrders.update({ _id: orderId }, { $pushAll: { Matches: matches }}, function(error, matches){
        if(!error){
            console.log('response:', matches);
            defered.resolve(matches);
        }else{
            defered.reject(error);
        }
    });
    return defered.promise;
};

MatchService.prototype.setMatched = function(orderId, tinderId) {
    return this.updateMatch(orderId, tinderId, {
        'Matches.$.Matched': true
    });
};

MatchService.prototype.updateMatch = function(orderId, tinderId, fields) {
    var defered = q.defer();
    db.SearchOrders.update(
        { 
            orderId: orderId,
            'Matches.TinderId': tinderId //lelijk #hack 'Matches.$field'
         },
        { $set: fields
    }, function(error){
        if(error){
            defered.reject(error);
        }else{
            defered.resolve();
        }
    });
    return defered.promise;
};

module.exports = new MatchService();
