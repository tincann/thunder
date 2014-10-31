var mongo = require('mongoskin');

var db = mongo.db("mongodb://php53-dev:27017/thunder-db", {native_parser:true});
// var db = mongo.db("mongodb://localhost:27017/thunder-db", {native_parser:true});

//collections binden
db.bind('FacebookAccounts');
db.bind('SearchOrders');
db.bind('TinderMatches');

db.bind('Q')

module.exports = {
    database: db
};