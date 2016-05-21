var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var emailUtils = require('../utils/email');
var writeToClient = require('../utils/writeToClient');
var config = require('../../config.json');
var serverSecret = process.env.SERVER_SECRET || config.SECRETS.serverSecret;
var ROLES = config.ROLES;


/**
 * User Login - match user password hash to hash in DB using passport strategy
 */
router.post('/login', passport.authenticate('local'),
    function (request, response) {

        debug('local login success');
        debug('local login user', request.user);

        writeToClient(response, {
            success: true,
            name: request.user.name,
            email: request.user.email,
            role: request.user.role,
            approved: request.user.approved,
            signup_complete: request.user.signup_complete,
            avatar: request.user.avatar,
            renovations: request.user.renovations,
            tasks: request.user.tasks,
            calendar_events: request.user.calendar_events,
            layout_settings: request.user.layout_settings
        });
    });

/**
 * check if user is logged in - has an active session
 */
router.get('/isLoggedIn', ensureAuthenticated, function (request, response) {
    return writeToClient(response, {
        success: true,
        name: request.user.name,
        email: request.user.email,
        role: request.user.role,
        approved: request.user.approved,
        signup_complete: request.user.signup_complete,
        avatar: request.user.avatar,
        renovations: request.user.renovations,
        tasks: request.user.tasks,
        calendar_events: request.user.calendar_events,
        layout_settings: request.user.layout_settings
    });
});


/**
 * Third party OAuth Login
 */
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/signup'}),
    function (request, response) {

        debug('google login success', request.user);
        response.redirect('/after-auth.html');
    });

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/signup'}),
    function (request, response) {

        debug('google login success', request.user);
        response.redirect('/after-auth.html');
    });


/**
 * User logout - Clear session
 */
router.get('/logout', ensureAuthenticated, function (request, response) {
    request.logout();
    return writeToClient(response, {success: true});
});


/**
 * User SignUp - create a temp account on sign up, send activation email with token
 */
router.post("/signup", function (request, response) {

    if(request.isAuthenticated())
        return writeToClient(response, null, "User Already Logged In", HttpStatus.BAD_REQUEST);

    try {
        var user = JSON.parse(request.body.user);
        if (!user || !user.email || !user.password)
            return writeToClient(response, null, "Please Provide all required fields", HttpStatus.BAD_REQUEST);

        user.role = ROLES.ADMIN; //FIXME change initial role to ROLES.GUEST;

        debug('signup user', user);
        delete user._id; //TODO check why user is receieved with _id = ''

        authUtils.signUp(user, function (error, result) {

            debug('signup result', result);
            debug('signup error', error);
            if (error) {
                debug('signup sending error');
                return writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

            }
            writeToClient(response, {success: true});
            var token = jwt.sign(user, serverSecret, {algorithm: 'HS512', expiresIn: "1h"});
            var link = 'http://' + request.hostname + '/api/auth/activation/' + token;
            emailUtils.activationEmail(user.email, user.name, link);
        });

    } catch (error) {
        writeToClient(response, null, "Error: Sign-Up Request Failed", HttpStatus.BAD_REQUEST);
        debug("SignUp error: ", error);
    }
});

/**
 * OAuth sign-up - user provides additional information to complete sign-up process
 */
router.post('/signup_oauth', ensureAuthenticated, function (request, response) {

    if (!request.body.info)
        return writeToClient(response, null, "Please Provide all required fields", HttpStatus.BAD_REQUEST);
    if(typeof request.user.signup_complete === 'undefined' || request.user.signup_complete === true)
        return writeToClient(response, null, "Sign-Up Process has already been completed", HttpStatus.BAD_REQUEST);


    var info = JSON.parse(request.body.info);
    authUtils.oauthSignup(request.user, info, function (error, result) {

        if(error)
            return writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

        debug('oauthSignup error', error);
        debug('oauthSignup result', result.result);
        debug('oauthSignup user', request.user);
        writeToClient(response, {success: true, message: "Sign-Up Process Completed Successfully"});
    });

});


/**
 * Account Activation route - Activate a temporary account, activation via Email with JWT
 * onerror : redirect to error page with error message
 * onsuccess : redirect to home page
 */
router.get('/activation/:token', function (request, response) {

    debug('activation token', request.params.token);
    jwt.verify(request.params.token, serverSecret, {algorithm: 'HS512'}, function (error, decoded) {
        delete decoded.createdAt;
        delete decoded.iat;
        delete decoded.exp;
        debug('activation error', error);
        debug('activation decoded', decoded);

        if (error)
            return response.redirect(encodeURI('/result/error/invalid token'));

        authUtils.activateAccount(decoded, function (error, result) {
            if (error) {
                debug('activation error', error);
                if (error.errmsg.indexOf('duplicate') !== -1)
                    return response.redirect(encodeURI('/result/error/account already activated'));

                return response.redirect(encodeURI('/result/error/account activation failed'));
            }


            debug('activation result', result);
            response.redirect('/signup/activated');
        });
    });
});


/**
 * Authenticate user - check if user is allowed to perform action base on user role
 */
router.get('/authenticate/:action', ensureAuthenticated, function (request, response) {

    debug('isAuthorized request action', request.params.action);
    debug('isAuthorized user', request.user);

    authUtils.isAuthorized(request.user.role, request.params.action, function (error, result) {

        if (error)
            return writeToClient(response, null, error.message, error.code);


        return writeToClient(response, result);
    });
});


/**
 * Change a user role - can only be invoked by an admin user.
 */
router.post('/assignrole', ensureAuthenticated, function (request, response) {

    if (!request.body.user || !request.body.newrole)
        return writeToClient(response, null, 'No user or new role provided', HttpStatus.BAD_REQUEST);

    if (request.user.role !== ROLES.ADMIN)
        return writeToClient(response, null, 'Not Allowed', HttpStatus.FORBIDDEN);

    var user = JSON.parse(request.body.user);
    var newRole = request.body.newrole;

    authUtils.setUserRole(user, newRole, function (error, result) {

        if (error)
            return writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

        debug('assignrole setUserRole error', error);
        debug('assignrole setUserRole result', result);
        writeToClient(response, result);
    });

});

/**
 * will take the email and the phone to ensure that the details are correct
 * and the new , old password too, to kip the need to open a new page to enter the passwords
 * the old password is needed if changing password , if forgot option the new password is enough
 */
router.post('/forgot', function (request, response) {

    var email = request.body.email;
    //  phone = request.params.phone;
    var newPassword = request.body.new_password;
    var oldPassword = request.body.old_password;

    /** in the case of change password , the user must be logged in*/
    if (request.isAuthenticated() && oldPassword !== null && oldPassword.length !== 0) {
        authUtils.setPassword({email: email}, oldPassword, newPassword, true, function (error, result) {
            if (error) {
                writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                if (result !== authUtils.messages.PASSWORD_UPDATE_SUCCESS) {
                    return response.redirect(encodeURI('/result/error/' + result));

                }

                return response.redirect(encodeURI('/result/info/' + result));
            }

        });
    }
    else {
        authUtils.passwordResetRequest(email, function (error, result) {
            if (error) {
                writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                /** the result will be the username if there is no errors*/
                const USER_DATA_NOT_EXIST = "Wrong Email.";
                if (result == USER_DATA_NOT_EXIST) {
                    writeToClient(response, result, "", HttpStatus.NOT_FOUND);
                    return response.redirect(encodeURI('/result/error/' + USER_DATA_NOT_EXIST));
                }
                else {
                    var token = jwt.sign({
                        email: email,
                        newPassword: newPassword,
                        iat: Math.floor(Date.now() / 1000)
                    }, serverSecret, {algorithm: 'HS512'});
                    var link = 'http://' + request.hostname + '/api/auth/reset/' + token;
                    emailUtils.resetPasswordEmail(email, result, link);

                    var message = "Email has been sent to reset the password";
                    return response.redirect(encodeURI('/result/info/' + message));
                }
            }
        });
    }

});

/**
 * Reset password
 */
router.get('/reset/:token', function (request, response) {

    debug('reset token', request.params.token);
    jwt.verify(request.params.token, serverSecret, {algorithm: 'HS512'}, function (error, decoded) {
        if (error)
            return response.redirect(encodeURI('/result/error/invalid token'));
        /**iat is a field that is added to be able to calc expire time and such things */
        delete decoded.iat;
        authUtils.setPassword({email: decoded.email}, "", decoded.newPassword, false, function (error, result) {
            if (error) {
                return response.redirect(encodeURI('/result/error/' + result));
            }
            debug('reset result', result);
            response.redirect('/login/');
        });
    });
});


/**
 * Middleware - Make sure user is logged in
 */
function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated())
        return next();

    return writeToClient(response, null, "Error: User is not logged in", HttpStatus.UNAUTHORIZED);
}

module.exports = router;
