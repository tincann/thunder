var q = require('q');
var tinder = require('tinderjs');

var db = require('../thunder-db').database;
var TinderMatch = require('../models/TinderMatch');

function TinderService(){
    this.client = new tinder.TinderClient();
}

TinderService.prototype.authorize = function(account) {
    var defered = q.defer();
    console.log('authorizing', account.FacebookId);
    this.client.authorize(account.FacebookToken, account.FacebookId, function(){
        console.log('authorized!'); 
        defered.resolve();
    });
    return defered.promise;
};

TinderService.prototype.setPosition = function(long, lat) {
    var defered = q.defer();
    this.client.updatePosition(long, lat, function(){
        defered.resolve();
    });
    return defered.promise;
};

TinderService.prototype.getRecommendations = function(facebookAccountId, sampleSize) {
    var defered = q.defer();
    this.client.getRecommendations(sampleSize, function(error, response){
        if(!error && response.status === 200){
            var recommendations = response.results;
            if(recommendations){
                console.log('matches found:', recommendations.length);
                var matches = recommendations.map(function(rec){
                    return new TinderMatch(rec);
                });
                defered.resolve(matches);
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


TinderService.prototype.likeBatch = function(orderId, matches) {
    var defereds = [];
    var self = this;
    matches.forEach(function(match){
        var defered = q.defer();
        console.log('liking match:', match.TinderId);
        self.client.like(match.TinderId, function(error, data){
            if(error){
                console.log('liking match failed:', error);
                defered.resolve(); //resolve, anders falen alle andere matches
                return;
            }

            console.log('likedata:', data);
            //andere user heeft ons ook geliked
            if(data.matched){
                console.log('You were liked back by:', match.TinderId);
                return MatchService.setMatched(orderId, match.TinderId);
            }
            defered.resolve();
        });
        defereds.push(defered.promise);
    });
    return q.all(defereds);
};


TinderService.prototype.getUpdates = function() {
    var defered = q.defer();
    this.client.getUpdates(function(updates){
        if(updates){
            console.log('received updates:', updates);
        }else{
            console.log('received no updates');
        }
        defered.resolve(updates);
    });
    return defered.promise;
};

TinderService.prototype.createInstance = function() {
    return new TinderService();
};

module.exports = new TinderService();
