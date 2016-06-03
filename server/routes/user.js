var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/user');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');


/**
 * Get all volunteers
 */
router.get('/all_users', middleware.ensureAuthenticated, middleware.ensurePermission, function(req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {approved: true}, function(error, result) {
        debug('all_users', error, result);

        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get users"});
        else if(!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No users found"});

        res.send(result);
    });

});


/**
 * Get all users who signed up
 */
router.get('/aLL_signups', middleware.ensureAuthenticated, middleware.ensurePermission, function(req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {approved: false}, function(error, result) {
        debug('aLL_signups', error, result);

        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get signups"});
        else if(!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No signups found"});

        res.send(result);
    });
});


/**
 * Approve User Sign-up
 */
router.post('/approve', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams, 
    function(req, res) {
    
    mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email}, {$set: {approved: true, role: req.body.role}}, {},
        function(error, result) {
            debug('approve', error, result);

        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to approve user"});

        res.send({success: true})
    })
});


/**
 * Delete User
 */
router.delete('/delete/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function(req, res) {
        
        mongoUtils.delete(COLLECTIONS.USERS, {email: req.params.email}, function(error, result) {
            debug('delete', req.params.email, error, result);

            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete user"});
            
            res.send({success: true})
        });
        
    });



module.exports = router;