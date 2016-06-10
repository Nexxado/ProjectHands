var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/user');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');


/**
 * Get user info
 */
router.get('/user_info/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, function (req, res) {

        delete req.queriedUser.password; //Don't send user password
        res.send(req.queriedUser);
    });

/**
 * Get all volunteers
 */
router.get('/all_users', middleware.ensureAuthenticated, middleware.ensurePermission, function (req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {}, function (error, result) {
        debug('all_users', error, result);

        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find users"});
        else if (!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No users found"});

        //filter out unapproved users.
        result = result.filter(function(user) {
            return typeof user.approved === 'undefined' || user.approved === true
        });

        //Don't send user password
        result.forEach(function(user) {
            delete user.password;
        });

        res.send(result);
    });

});


/**
 * Get all users who signed up
 */
router.get('/all_signups', middleware.ensureAuthenticated, middleware.ensurePermission, function (req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {approved: false}, function (error, result) {
        debug('aLL_signups', error, result);

        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find signups"});
        else if (!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No signups found"});

        //Filter out OAuth2 users who didn't complete the signup process
        result = result.filter(function(user) {
            return typeof user.signup_complete === 'undefined' || user.signup_complete === true
        });

        //Don't send user password
        result.forEach(function(user) {
            delete user.password;
        });

        res.send(result);
    });
});


/**
 * Approve User Sign-up
 */
router.post('/approve', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, function (req, res) {

        if (req.queriedUser.approved)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User already approved"});

        mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email}, 
            {$set: {approved: true, role: req.body.role}, $unset: {signupDate: ''}}, 
            {},
            function (error, result) {
                debug('approve', error, result.result);

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to approve user"});

                res.send({success: true})
            });
    });


/**
 * Delete User
 */
router.delete('/delete/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        mongoUtils.delete(COLLECTIONS.USERS, {email: req.params.email}, function (error, result) {
            debug('delete', req.params.email, error, result.result);

            if (error || result.result.n === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete user"});

            res.send({success: true})
        });

    });


/**
 * Change a user role
 */
router.post('/assign_role', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, function (req, res) {

        mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email}, {$set: {role: req.body.newRole}}, {},
            function (error, result) {

                debug('assign_role', error, result);
                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed change user role"});

                return res.send({success: true});
            });

    });


module.exports = router;