let express = require('express');
let router = express.Router();
const {ensureAuthenticated} = require('../config/authenticated');

/*
Get secure page
*/
router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('secure', {
        title : 'Secure Page !'
    });
});

module.exports = router;