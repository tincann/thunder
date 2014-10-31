var FacebookService = require('../services/FacebookService');

var tinder = require('tinderjs');
var client = new tinder.TinderClient();

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
    console.log('search order added the bot queue', order);
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
    FacebookService.getByFbId(order.facebookAccountId).then(function(account){

        //login
        client.authorize(account.FacebookToken, account.FacebookId, function(response){
            var settings = client.getDefaults();
            setSettings(settings);
             
            //set lat long
            client.updatePosition('4.897156', '52.368368', function(){

                //get recommendations
                client.getRecommendations(1, function(error, data){
                        console.log(error);
                        console.log(data);
                });
            });
        });
    });
};

var setSettings = function(settings){
    settings.user.age_filter_min = 18;
    console.log(settings);
};


module.exports = new SearchOrderBot(50);