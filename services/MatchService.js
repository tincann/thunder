var db = require('../thunder-db').database;
var TinderMatch = require('../models/TinderMatch');
var q = require('q');

function MatchService(){

}

MatchService.prototype.insertMatches = function(facebookAccountId, matches) {
    var defereds = [];

    for(var i = 0; i < matches.length; i++){
        var defered = q.defer();

        var matchInfo = matches[i];
        var tinderMatch = new TinderMatch(facebookAccountId, matchInfo);
        db.TinderMatches.insert(tinderMatch, function(error, match){
            if(!error){
                defered.resolve(match[0]);
            }else{
                defered.reject(error);
            }
        });
        defereds.push(defered.promise);
    }

    return q.all(defereds).then(function(){ return matches});
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
