var db = require('../thunder-db').database;

var STATUS = {
    IDLE: 0,
    RUNNING: 1
};

function SearchUpdateBot(pollInterval){
    this.interval = setInterval(this.loop.bind(this), pollInterval || 660

}

SearchUpdateBot.prototype.loop = function() {
    console.log('getting tinder updates');

};

module.exports = new SearchUpdateBot();