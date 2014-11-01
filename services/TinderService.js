var q = require('q');
var tinder = require('tinderjs');
var MatchService = require('../services/MatchService');

var db = require('../thunder-db').database;
var TinderMatch = require('../models/TinderMatch');

function TinderService(){
    this.client = new tinder.TinderClient();
}

TinderService.prototype.authorize = function(account) {
    var defered = q.defer();
    console.log('authorizing', account.FacebookId);
    var self = this;
    this.client.authorize(account.FacebookToken, account.FacebookId, function(){
        console.log('authorized!'); 
        console.log(self.client.getDefaults());
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
        console.log(response);
        if(response.message == 'recs timeout'){
            console.log('recommendation timeout!!!!!');
            return;
        }
        if(error){
            defered.reject(error);
        }else if(response.status === 200){
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
            if(data && data.match){
                console.log('You were liked back by:', match.TinderId);
                return MatchService.setMatched(orderId, match.TinderId);
            }else{
                return MatchService.setLiked(orderId, match.TinderId);
            }
        });
        defereds.push(defered.promise);
    });
    return q.all(defereds);
};

TinderService.prototype.sendMessage = function(orderId, tinderId, message) {
    var defered = q.defer();



    return defered.promise;
};


TinderService.prototype.getUpdates = function() {
    var defered = q.defer();
    this.client.getUpdates(function(error,updates){
        if(error){
            defered.reject(error);
        }else{
            if(updates){
                defered.resolve(updates);
            }else{
                defered.reject('no updates');
            }
        }
    });
    return defered.promise;
};

TinderService.prototype.createInstance = function() {
    return new TinderService();
};

module.exports = new TinderService();
