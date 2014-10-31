var db = require('../thunder-db').database;
var q = require('q');

function FacebookService(){
    console.log('running');
};

FacebookService.prototype.getByFbId = function(id) {
    var defered = q.defer();
    console.log('searching for fbId:', id);
    db.FacebookAccounts.findOne({FacebookId: id}, function(error, result){
        console.log(error);
        console.log('found facebook account:', result);
        defered.resolve(result);
    });
    return defered.promise;
};

module.exports = new FacebookService();