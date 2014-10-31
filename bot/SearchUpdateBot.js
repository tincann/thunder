var db = require('../thunder-db').database;
var TinderService = require('../services/TinderService');

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchUpdateBot(pollInterval){
    this.interval = setInterval(this.loop.bind(this), pollInterval || 60 * 1000);
}

SearchUpdateBot.prototype.loop = function() {
    console.log('getting tinder updates');
    TinderService.getUpdates().then(function(updates){
        //something
    });
};

module.exports = new SearchUpdateBot();