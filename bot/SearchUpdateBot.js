var db = require('../thunder-db').database;
var TinderService = require('../services/TinderService').createInstance(); //eigen instantie ipv singleton
var SearchService = require('../services/SearchService');
var FacebookService = require('../services/FacebookService');

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchUpdateBot(){
    this.status = STATUS.IDLE;
}

SearchUpdateBot.prototype.start = function(pollInterval) {
    console.log('starting interval');
    this.loop();
    //this.interval = setInterval(this.loop.bind(this), pollInterval || (60 * 1000));
};

SearchUpdateBot.prototype.stop = function() {
    clearInterval(this.interval);
};

SearchUpdateBot.prototype.loop = function() {
    var self = this;
    if(this.status == STATUS.IDLE){
        console.log('getting tinder updates');
        SearchService.getCompletedSearchOrders().then(function(searchOrders){
            this.status = STATUS.RUNNING;

            if(!searchOrders){
                console.log('no completed orders found');
            }else{
                searchOrders.forEach(function(searchOrder){
                    console.log('updating searchorder:', searchOrder._id);
                    FacebookService.getByFbId(searchOrder.FacebookAccountId).then(function(account){
                        return TinderService.authorize(account);
                    }).then(function(){
                        return TinderService.getUpdates();
                    }).then(function(updates){
                        if(updates){
                            
                        }else{
                            console.log('received no updates');
                        }
                    }).fail(function(error){
                        console.log(error);
                    }).done();
                });
            }
        }).fail(function(error){
            console.log(error);
        }).done(function(){
            self.status = STATUS.IDLE;
        });
    }
};

module.exports = new SearchUpdateBot();