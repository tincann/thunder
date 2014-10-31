var q = require('q');
var tinder = require('tinderjs');
var client = new tinder.TinderClient();
var db = require('../thunder-db').database;
var TinderMatch = require('../models/TinderMatch');

function TinderService(){

}

TinderService.prototype.authorize = function(account) {
    var defered = q.defer();
    console.log('authorizing', account.FacebookId);
    try{
        client.authorize(account.FacebookToken, account.FacebookId, function(){
            console.log('authorized!');
            defered.resolve();
        });
    }catch(error){
        defered.reject(error);
    }
    return defered.promise;
};

TinderService.prototype.setPosition = function(long, lat) {
    var defered = q.defer();
    client.updatePosition('4.897156', '52.368368', function(){
        defered.resolve();
    });
    return defered.promise;
}; 

TinderService.prototype.getRecommendations = function(facebookAccountId, sampleSize) {
    var defered = q.defer();
    client.getRecommendations(sampleSize, function(error, response){
        if(!error && response.status === 200){
            var recommendations = response.results;
            if(recommendations){
                console.log('matches found:', recommendations.length);
                var matches = recommendations.map(function(rec){
                    return new TinderMatch(facebookAccountId, rec);
                });

                defered.resolve(recommendations);
            }else{
                console.log('no recommendation found :(');
                defered.reject();
            }
        }else{
            defered.reject(error);
        }
    });
    return defered.promise;
};


TinderService.prototype.likeBatch = function(matches) {
    var defereds = [];
    for(var i  = 0; i < matches.length; i++){
        var defered = q.defer();
        var match = matches[i];
        client.like(match.TinderId, function(error, data){
            if(error){
                console.log('liking match failed:', error);
                defered.resolve(); //anders falen alle andere matches
                return;
            }

            //andere user heeft ons ook geliked
            if(data.matched){
                console.log('You were liked back by:', match.TinderId);
                return MatchService.setMatch(match.TinderId);
            }
            defered.resolve();
        });
        defereds.push(defered.promise);
    }
    q.all(defereds);
};

module.exports = new TinderService();
