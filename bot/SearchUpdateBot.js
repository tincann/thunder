var db = require('../thunder-db').database;
var TinderService = require('../services/TinderService').cloneService(); //eigen instantie ipv singleton
var SearchService = require('../services/SearchService');
var FacebookService = require('../services/FacebookService');

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchUpdateBot(){
}

SearchUpdateBot.prototype.start = function(pollInterval) {
    console.log('starting interval');
    // this.interval = setInterval(this.loop.bind(this), pollInterval || (60 * 1000));
    this.loop();
};

SearchUpdateBot.prototype.stop = function() {
    clearInterval(this.interval);
};

SearchUpdateBot.prototype.loop = function() {
    console.log('getting tinder updates');
    SearchService.getRunningSearchOrders()
    .then(function(searchOrders){
        searchOrders.forEach(function(searchOrder){
            console.log('updating searchorder:', searchOrder);
            FacebookService.getByFbId(searchOrder.FacebookAccountId).then(function(account){
                return TinderService.authorize(account);
            }).then(function(){
                return TinderService.getUpdates();
            }).then(function(updates){
                if(updates){
                    console.log('received updates:', updates);
                }else{
                    console.log('received no updates');
                }
            });
        });
    }).fail(function(error){
        console.log(error);
    });;
};

module.exports = new SearchUpdateBot();