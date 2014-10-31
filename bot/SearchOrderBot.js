var FacebookService = require('../services/FacebookService');
var MatchService = require('../services/MatchService');
var TinderService = require('../services/TinderService');

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchOrderBot(pollInterval){
    this.orderQueue = [];
    this.status = STATUS.IDLE;
    this.interval = setInterval(this.loop.bind(this), pollInterval || 50);
}

SearchOrderBot.prototype.addOrder = function(order) {
    this.orderQueue.push(order);
};

SearchOrderBot.prototype.loop = function() {
    if(this.status === STATUS.IDLE){
        var order = this.orderQueue.shift();
        if(order){
            console.log('dequeued order:', order);
            this.start(order);
        }
    }
};

SearchOrderBot.prototype.start = function(order){
    console.log('bot starting on order:', order);
    this.status = STATUS.RUNNING;
    FacebookService.getByFbId(order.FacebookAccountId).then(function(account){
        TinderService.authorize(account).then(function(){
            return TinderService.setPosition('4.897156', '52.368368');
        }).then(function(){
            return TinderService.getRecommendations(order.SampleSize);
        }).then(function(matches){
            return MatchService.insertMatches(account.FacebookId, matches);
        }).fail(function(error){
            console.log('echt iets misgegaan');
        });
    });
};

SearchOrderBot.prototype.stop = function(){
    clearInterval(this.interval);
}

var setSettings = function(settings){
    settings.user.age_filter_min = 18;
    console.log(settings);
};

module.exports = new SearchOrderBot(50);
