var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/user');
var config = require('../../config.json');
// var ROLES = config.ROLES;
// var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) {
//     return ROLES[key];
// }).reverse();
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');


/**
 * Get all volunteers
 */
router.get('/all_users', middleware.ensureAuthenticated, middleware.ensurePermission, function(req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {approved: true}, function(error, result) {
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
        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get signups"});
        else if(!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No signups found"});

        res.send(result);
    });
});


module.exports = router;