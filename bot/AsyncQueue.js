var EventEmitter = require('events').EventEmitter;
util.inherits(AsyncQueue, EventEmitter);

function AsyncQueue(pollInterval){
}

AsyncQueue.prototype.enqueue = function(item) {
    this.trigger('dequeue', item);
};

module.exports = new AsyncQueue();