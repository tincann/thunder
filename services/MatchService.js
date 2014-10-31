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

    return q.all(defereds);
};

module.exports = new MatchService();
