var q = require('q');
var tinder = require('tinderjs');
var client = new tinder.TinderClient();

function TinderService(){

}

TinderService.prototype.authorize = function(account) {
    var defered = q.defer();
    console.log('authorizing', account.FacebookId);
    client.authorize(account.FacebookToken, account.FacebookId, function(response){
        console.log('authorized!', response);
        defered.resolve();
    });
    return defered.promise;
};

TinderService.prototype.setPosition = function(long, lat) {
    var defered = q.defer();

    client.updatePosition('4.897156', '52.368368', function(){
        defered.resolve();
    });

    return defered.promise;
};

TinderService.prototype.getRecommendations = function(sampleSize) {
    var defered = q.defer();
    client.getRecommendations(sampleSize, function(error, response){
        if(!error && response.status === 200){
            if(recommendations){
                console.log('matches found:', recommendations.length);
                defered.resolve(response.results);        
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

module.exports = new TinderService();