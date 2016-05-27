var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/status');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');


/**
 * Expected Params:
 * @param active {boolean} : status
 * @param message {string} : message to be shown along status
 */
router.post('/update_status', middleware.ensureAuthenticated, middleware.ensurePermission, function(req, res) {

    if(req.body.active === undefined || req.body.active === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Please provide all required fields");

    if(!req.body.message)
        req.body.message = '';

    mongoUtils.update(COLLECTIONS.ADMIN,
        {_id: 'status'},
        {$set: {active: req.body.active, message: req.body.message}},
        {upsert: true},
        function(error, result) {
            if(error || !result)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send({active: req.body.active, message: req.body.message});
        })
});

/**
 * Returns current Status
 */
router.get('/get_status', function(req, res) {

    mongoUtils.query(COLLECTIONS.ADMIN, {_id: 'status'}, function(error, result) {
        if(error || !result || !result.length)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result[0]);
    })

});




module.exports = router;