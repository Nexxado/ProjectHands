var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var emailUtils = require('../utils/email');
var writeToClient = require('../utils/writeToClient');
var config = require('../../config.json');
var middleware = require('../utils/middleware');
var serverSecret = process.env.SERVER_SECRET || config.SECRETS.serverSecret;
var ROLES = config.ROLES;


/**
 * User Login - match user password hash to hash in DB using passport strategy
 */
router.post('/login', passport.authenticate('local'),
    function (req, res) {

        debug('local login success');
        debug('local login user', req.user);

        writeToClient(res, {
            success: true,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            approved: req.user.approved,
            signup_complete: req.user.signup_complete,
            avatar: req.user.avatar,
            renovations: req.user.renovations,
            tasks: req.user.tasks,
            calendar_events: req.user.calendar_events,
            layout_settings: req.user.layout_settings
        });
    });

/**
 * check if user is logged in - has an active session
 */
router.get('/isLoggedIn', middleware.ensureAuthenticated, function (req, res) {
    return writeToClient(res, {
        success: true,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        approved: req.user.approved,
        signup_complete: req.user.signup_complete,
        avatar: req.user.avatar,
        renovations: req.user.renovations,
        tasks: req.user.tasks,
        calendar_events: req.user.calendar_events,
        layout_settings: req.user.layout_settings
    });
});


/**
 * Third party OAuth Login
 */
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/signup'}),
    function (req, res) {

        debug('google login success', req.user);
        res.redirect('/after-auth.html');
    });

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/signup'}),
    function (req, res) {

        debug('google login success', req.user);
        res.redirect('/after-auth.html');
    });


/**
 * User logout - Clear session
 */
router.get('/logout', middleware.ensureAuthenticated, function (req, res) {
    req.logout();
    return writeToClient(res, {success: true});
});


/**
 * User SignUp - create a temp account on sign up, send activation email with token
 */
router.post("/signup", function (req, res) {

    if(req.isAuthenticated())
        return writeToClient(res, null, "User Already Logged In", HttpStatus.BAD_REQUEST);

    try {
        var user = JSON.parse(req.body.user);
        if (!user || !user.email || !user.password || !user.name || !user.phone)
            return writeToClient(res, null, "Please Provide all required fields", HttpStatus.BAD_REQUEST);

        user.role = ROLES.ADMIN; //FIXME change initial role to ROLES.GUEST;

        debug('signup user', user);
        delete user._id; //TODO check why user is receieved with _id = ''

        authUtils.signUp(user, function (error, result) {

            debug('signup result', result);
            debug('signup error', error);
            if (error) {
                debug('signup sending error');
                return writeToClient(res, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

            }
            writeToClient(res, {success: true});
            var token = jwt.sign(user, serverSecret, {algorithm: 'HS512', expiresIn: "1h"});
            var link = 'http://' + req.hostname + '/api/auth/activation/' + token;
            emailUtils.activationEmail(user.email, user.name, link);
        });

    } catch (error) {
        writeToClient(res, null, "Error: Sign-Up Request Failed", HttpStatus.BAD_REQUEST);
        debug("SignUp error: ", error);
    }
});

/**
 * OAuth sign-up - user provides additional information to complete sign-up process
 */
router.post('/signup_oauth', middleware.ensureAuthenticated, function (req, res) {

    if (!req.body.info)
        return writeToClient(res, null, "Please Provide all required fields", HttpStatus.BAD_REQUEST);
    if(typeof req.user.signup_complete === 'undefined' || req.user.signup_complete === true)
        return writeToClient(res, null, "Sign-Up Process has already been completed", HttpStatus.BAD_REQUEST);


    var info = JSON.parse(req.body.info);
    authUtils.oauthSignup(req.user, info, function (error, result) {

        if(error)
            return writeToClient(res, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

        debug('oauthSignup error', error);
        debug('oauthSignup result', result.result);
        debug('oauthSignup user', req.user);
        writeToClient(res, {success: true, message: "Sign-Up Process Completed Successfully"});
    });

});


/**
 * Account Activation route - Activate a temporary account, activation via Email with JWT
 * onerror : redirect to error page with error message
 * onsuccess : redirect to home page
 */
router.get('/activation/:token', function (req, res) {

    debug('activation token', req.params.token);
    jwt.verify(req.params.token, serverSecret, {algorithm: 'HS512'}, function (error, decoded) {
        delete decoded.createdAt;
        delete decoded.iat;
        delete decoded.exp;
        debug('activation error', error);
        debug('activation decoded', decoded);

        if (error)
            return res.redirect(encodeURI('/result/error/invalid token'));

        authUtils.activateAccount(decoded, function (error, result) {
            if (error) {
                debug('activation error', error);
                if (error.errmsg.indexOf('duplicate') !== -1)
                    return res.redirect(encodeURI('/result/error/account already activated'));

                return res.redirect(encodeURI('/result/error/account activation failed'));
            }


            debug('activation result', result);
            res.redirect('/signup/activated');
        });
    });
});


/**
 * Authenticate user - check if user is allowed to perform action base on user role
 */
router.get('/authenticate/:action', middleware.ensureAuthenticated, middleware.ensurePermission, function (req, res) {

    res.send({success: true});
});


/**
 * Change a user role - can only be invoked by an admin user.
 */
router.post('/assignrole', middleware.ensureAuthenticated, function (req, res) {

    if (!req.body.user || !req.body.newrole)
        return writeToClient(res, null, 'No user or new role provided', HttpStatus.BAD_REQUEST);

    if (req.user.role !== ROLES.ADMIN)
        return writeToClient(res, null, 'Not Allowed', HttpStatus.FORBIDDEN);

    var user = JSON.parse(req.body.user);
    var newRole = req.body.newrole;

    authUtils.setUserRole(user, newRole, function (error, result) {

        if (error)
            return writeToClient(res, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

        debug('assignrole setUserRole error', error);
        debug('assignrole setUserRole result', result);
        writeToClient(res, result);
    });

});

/**
 * will take the email and the phone to ensure that the details are correct
 * and the new , old password too, to kip the need to open a new page to enter the passwords
 * the old password is needed if changing password , if forgot option the new password is enough
 */
router.post('/forgot', function (req, res) {

    var email = req.body.email;
    //  phone = req.params.phone;
    var newPassword = req.body.new_password;
    var oldPassword = req.body.old_password;

    /** in the case of change password , the user must be logged in*/
    if (req.isAuthenticated() && oldPassword !== null && oldPassword.length !== 0) {
        authUtils.setPassword({email: email}, oldPassword, newPassword, true, function (error, result) {
            if (error) {
                writeToClient(res, null, error, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                if (result !== authUtils.messages.PASSWORD_UPDATE_SUCCESS) {
                    return res.redirect(encodeURI('/result/error/' + result));

                }

                return res.redirect(encodeURI('/result/info/' + result));
            }

        });
    }
    else {
        authUtils.passwordResetRequest(email, function (error, result) {
            if (error) {
                writeToClient(res, null, error, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                /** the result will be the username if there is no errors*/
                const USER_DATA_NOT_EXIST = "Wrong Email.";
                if (result == USER_DATA_NOT_EXIST) {
                    writeToClient(res, result, "", HttpStatus.NOT_FOUND);
                    return res.redirect(encodeURI('/result/error/' + USER_DATA_NOT_EXIST));
                }
                else {
                    var token = jwt.sign({
                        email: email,
                        newPassword: newPassword,
                        iat: Math.floor(Date.now() / 1000)
                    }, serverSecret, {algorithm: 'HS512'});
                    var link = 'http://' + req.hostname + '/api/auth/reset/' + token;
                    emailUtils.resetPasswordEmail(email, result, link);

                    var message = "Email has been sent to reset the password";
                    return res.redirect(encodeURI('/result/info/' + message));
                }
            }
        });
    }

});

/**
 * Reset password
 */
router.get('/reset/:token', function (req, res) {

    debug('reset token', req.params.token);
    jwt.verify(req.params.token, serverSecret, {algorithm: 'HS512'}, function (error, decoded) {
        if (error)
            return res.redirect(encodeURI('/result/error/invalid token'));
        /**iat is a field that is added to be able to calc expire time and such things */
        delete decoded.iat;
        authUtils.setPassword({email: decoded.email}, "", decoded.newPassword, false, function (error, result) {
            if (error) {
                return res.redirect(encodeURI('/result/error/' + result));
            }
            debug('reset result', result);
            res.redirect('/login/');
        });
    });
});




module.exports = router;
