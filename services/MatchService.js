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

//Als andere persoon jou ook een like geeft dan is er een match!
MatchService.prototype.setMatched = function(tinderId) {
    var defered = q.defer();
    db.TinderMatches.update(
        { TinderId: match.TinderId },
        { $set: { matched: true }
    }, function(error){
        if(error){
            defered.reject(error);
            return;
        }
        defered.resolve();
    });
    return defered.promise;
};

MatchService.prototype.getMatchesForFbId = function(facebookAccountId) {
    var defered = q.defer();

    db.TinderMatches.find({ FacebookAccountId: facebookAccountId }, function(error, matches){
        if(error){
            defered.reject(error);
            return
        }else{
            defered.resolve(matches);
        }
    });
    return defered.promise;
};

module.exports = new MatchService();
