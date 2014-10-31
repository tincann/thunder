var FacebookService = require('../services/FacebookService');
var MatchService = require('../services/MatchService');
var TinderService = require('../services/TinderService');
var TinderMatch = require('../models/TinderMatch');

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchOrderBot(){
    this.orderQueue = [];
    this.status = STATUS.IDLE;
}

SearchOrderBot.prototype.addOrder = function(order) {
    this.orderQueue.push(order);
};

SearchOrderBot.prototype.loop = function() {
    if(this.status === STATUS.IDLE){
        var order = this.orderQueue.shift();
        if(order){
            console.log('dequeued order:', order);
            this.processOrder(order);
        }
    }
};

SearchOrderBot.prototype.start = function(pollInterval) {
    this.interval = setInterval(this.loop.bind(this), pollInterval || 50);
};

SearchOrderBot.prototype.processOrder = function(order){
    console.log('bot starting on order:', order);
    this.status = STATUS.RUNNING;
    FacebookService.getByFbId(order.FacebookAccountId).then(function(account){
        TinderService.authorize(account).then(function(){
            return TinderService.setPosition('4.897156', '52.368368'); //todo niet hardcoden
        }).then(function(){
            return TinderService.getRecommendations(order.FacebookAccountId, order.SampleSize);
        }).then(function(matches){
            return MatchService.insertMatches(account.FacebookId, matches)
            .then(function(){
                return MatchService.likeBatch(matches);
            });
        }).fail(function(error){
            console.log('echt iets misgegaan', error);
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

module.exports = new SearchOrderBot();
