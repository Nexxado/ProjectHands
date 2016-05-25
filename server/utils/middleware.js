/**
 * Created by ND88 on 25/05/2016.
 */

var mongoUtils = require('./mongo');
var debug = require('debug')('utils/middleware');
var HttpStatus = require('http-status-codes');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var ROLES = config.ROLES;
var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) {
    return ROLES[key];
}).reverse();
var middleware = {};

/**
 * Middleware - Make sure user is logged in
 */
middleware.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(HttpStatus.UNAUTHORIZED).send("Error: User is not logged in");
};

/**
 * Check if a user is authorized to access a certain action
 */
middleware.ensurePermission = function(req, res, next) {

    var action = req.params.action || req.body.action;
    debug('ensurePermission request action', action);
    debug('ensurePermission user', req.user.role);

    mongoUtils.query(COLLECTIONS.ACTIONS, {action: action}, function (error, result) {

        if (error || !result || result.length !== 1)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");

        if (ROLES_HIERARCHY.indexOf(req.user.role) < ROLES_HIERARCHY.indexOf(result[0].role))
            return res.status(HttpStatus.FORBIDDEN).send("Not Allowed");

        next();
    });
};


module.exports = middleware;