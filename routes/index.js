var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    req.db.FacebookAccounts.find().toArray(function(err, items){
        console.log(items);
        res.render('index', { title: 'test', items: items});
    });
});

module.exports = router;
