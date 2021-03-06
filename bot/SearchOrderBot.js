var FacebookService = require('../services/FacebookService');
var MatchService = require('../services/MatchService');
var TinderService = require('../services/TinderService');
var TinderMatch = require('../models/TinderMatch');
var SearchService = require('../services/SearchService');

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
    var self = this;
    if(this.status === STATUS.IDLE){
        this.dequeueOrder()
        .then(this.processOrder)
        .fail(function(error){
            console.log(error);
        }).done(function(){
            console.log('done');
            self.status = STATUS.IDLE;
        });
    }
};

SearchOrderBot.prototype.start = function(pollInterval) {
    this.interval = setInterval(this.loop.bind(this), pollInterval || 1000);
    // this.loop();
};

SearchOrderBot.prototype.dequeueOrder = function() {
    console.log('dequeueing order');
    this.status = STATUS.RUNNING;
    return SearchService.getFirstReadySearchOrder().then(function(searchOrder){
        if(searchOrder){
            console.log('order found:', searchOrder);
            return searchOrder;
        }else{
            throw new Error("No order found");
        }        
    });
};

SearchOrderBot.prototype.processOrder = function(order){
    console.log('bot starting on order:', order);

    return SearchService.updateSearchOrderStatus(order._id, 'running').then(function(searchOrder){
        console.log('status running set on', order._id);
        return FacebookService.getByFbId(order.FacebookAccountId);
    }).then(function(account){
        return TinderService.authorize(account);
    }).then(function(){
        console.log('setting position');
        return TinderService.setPosition('5.119527', '52.078969'); //todo niet hardcoden
    }).then(function(){
        console.log('getting recommendations');
        return TinderService.getRecommendations(order.FacebookAccountId, order.SampleSize);
    }).then(function(matches){
        console.log('setting inserting matches');
        return MatchService.insertMatches(order._id, matches).then(function(){
            return TinderService.likeBatch(order._id, matches);
        });
    }).then(function(){
        return SearchService.completeSearchOrder(order._id);
    }).fail(function(error){
        console.log('echt iets misgegaan', error);
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
