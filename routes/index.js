let express = require('express');
let router = express.Router();

/*
Home page
*/
router.get('/', function(req, res, next){
    res.render('index', {
        title : 'Online Shop'
    });
});

module.exports = router;