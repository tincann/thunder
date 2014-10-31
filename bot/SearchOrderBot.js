var queue = require('./AsyncQueue');
var tinderjs = require('tinderjs');


queue.on('dequeue', function(orderId){
    console.log('iets gedequeued');
});

module.exports = {
    queue: queue
};