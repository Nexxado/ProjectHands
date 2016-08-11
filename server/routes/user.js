var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/user');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');


router.get('/user_info/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, sendFullUserInfo);

router.get('/basic/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, sendBasicUserInfo);

router.get('/all_users', middleware.ensureAuthenticated, middleware.ensurePermission, getAllUsers);

router.get('/all_signups', middleware.ensureAuthenticated, middleware.ensurePermission, getAllSignups);

router.get('/all_rejected', middleware.ensureAuthenticated, middleware.ensurePermission, getAllRejects);

router.post('/approve', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, approveUser);

router.post('/reject', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, rejectUser);

router.delete('/delete/:email', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    deleteUser);

router.post('/assign_role', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, assignUserRole);

router.post('/update', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, updateUserData);

router.post('/note', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureUserExists, updateUserNote);


/**
 * Get full user info
 */
function sendFullUserInfo(req, res) {

    delete req.queriedUser.password; //Don't send user password
    res.send(req.queriedUser);
}

/**
 * Get basic user info
 */
function sendBasicUserInfo(req, res) {

    var info = {
        email: req.queriedUser.email,
        name: req.queriedUser.name,
        phone: req.queriedUser.phone
    };

    res.send(info);
}


/**
 * Get all volunteers
 */
function getAllUsers(req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {}, function (error, result) {
        debug('all_users', error, result);

        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find users"});
        else if (!result.length)
            return res.send([]);

        //filter out unapproved users.
        result = result.filter(function (user) {
            return typeof user.approved === 'undefined' || user.approved === true
        });

        //Don't send user password
        result.forEach(function (user) {
            delete user.password;
        });

        res.send(result);
    });

}

/**
 * Get all users who signed up
 */
function getAllSignups(req, res) {

    mongoUtils.query(COLLECTIONS.USERS, {approved: false}, function (error, result) {
        debug('aLL_signups', error, result);

        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find signups"});
        else if (!result.length)
            return res.send([]);

        //Filter out OAuth2 users who didn't complete the signup process
        //Or rejected users
        result = result.filter(function (user) {
            return (typeof user.signup_complete === 'undefined' || user.signup_complete === true)
                && (typeof user.rejected === 'undefined' || user.rejected === false)
        });

        //Don't send user password
        result.forEach(function (user) {
            delete user.password;
        });

        res.send(result);
    });
}

/**
 * Get all rejected users
 */
function getAllRejects(req, res) {
    mongoUtils.query(COLLECTIONS.USERS, {rejected: true}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find signups"});
        else if (!result.length)
            return res.send([]);

        //Don't send user password
        result.forEach(function (user) {
            delete user.password;
        });

        res.send(result);
    });
}

/**
 * Approve User Sign-up
 */
function approveUser(req, res) {

    if (req.queriedUser.approved)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User already approved"});

    mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email},
        {$set: {approved: true, role: req.body.role}, $unset: {signupDate: '', rejected: ''}},
        {},
        function (error, result) {
            debug('approve', error, result.result);

            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to approve user"});

            res.send({success: true})
        });
}

/**
 * Reject User - move to rejects list.
 */
function rejectUser(req, res) {

    if (req.queriedUser.rejected)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User already marked as rejected"});

    mongoUtils.update(COLLECTIONS.USERS, {email: req.queriedUser.email}, {
            $set: {
                rejected: true,
                approved: false
            }
        }, {},
        function (error, result) {
            debug('reject', req.queriedUser.email, error, result.result);

            if (error || result.result.n === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to reject user"});

            res.send({success: true});
        });
}

/**
 * Delete User
 */
function deleteUser(req, res) {

    mongoUtils.delete(COLLECTIONS.USERS, {email: req.params.email}, function (error, result) {
        debug('delete', req.params.email, error, result.result);

        if (error || result.result.n === 0)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete user"});

        res.send({success: true})
    });

}

/**
 * Change a user role
 */
function assignUserRole(req, res) {

    mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email}, {$set: {role: req.body.newRole}}, {},
        function (error, result) {

            debug('assign_role', error, result);
            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed change user role"});

            return res.send({success: true});
        });

}

/**
 * Update user details
 */
function updateUserData(req, res) {

    var updatedData = {
        name: req.body.name,
        phone: req.body.phone,
        role: req.body.role
    };

    mongoUtils.update(COLLECTIONS.USERS, {email: req.body.email}, {$set: updatedData}, {}, function (error, result) {
        debug('update', error, result);
        if (error || result.result.nModified === 0)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed update user data"});

        return res.send({success: true});
    })

}


/**
 * Update a user's note, notes are written by admins for future reference
 * currently only for users marked as rejected
 */
function updateUserNote(req, res) {
    if(!req.queriedUser.rejected)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: 'notes are allowed only for rejected users'});

    mongoUtils.update(COLLECTIONS.USERS, {email: req.queriedUser.email}, {$set: {admin_note: req.body.admin_note}}, {},
        function(error, result) {

            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to update user's notes"});

            return res.send({success: true});
        });
}


module.exports = router;