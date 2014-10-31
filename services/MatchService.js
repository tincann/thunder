var db = require('../thunder-db').database;
var q = require('q');

function MatchService(){

}

MatchService.prototype.insertMatch = function(facbookAccountId, matchInfo) {
    var defered = q.defer();

    var tinderMatch = new TinderMatch(facebookAccountId, matchInfo);
    db.Matches.insert(tinderMatch, ,function(error, result){
        if(!error){
            defered.resolve(result);
        }else{
            
        }
    });

    return defered.promise;
};