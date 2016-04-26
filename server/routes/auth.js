var router = require('express').Router();
var Cookie = require('cookies');
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var emailUtils = require('../utils/email');
var writeToClient = require('../utils/writeToClient');
var config = require('../../config.json');
var serverSecret = process.env.SERVER_SECRET || config.serverSecret;
var cookieSecret = process.env.COOKIE_SECRET || config.cookieSecret;
var ROLES = config.ROLES;


/*
 * User Login - match user password hash to hash in DB, set JWT cookie if successful.
 */
router.post("/login", function (request, response) {
    try {
        var credentials = JSON.parse(request.body.credentials);
        var key = request.body.hash;

        //Var cookie = request.cookie;

        //we get the user password from the DB
        authUtils.login(credentials, key, function (error, user) {

            debug('login result', user);
            debug('login error', error);
            if (user) {
                var cookie = new Cookie(request, response, { //TODO add options for secure when server will run on HTTPS
                    keys: [cookieSecret]
                });

                var options = {
                    algorithm: 'HS512'
                };

                if(!credentials.remember) {
                    debug('remember = false');
                    options.expiresIn = '2h'; //TODO change to longer time
                }

                delete user.password;
                var token = jwt.sign(user, serverSecret, options);
                cookie.set(config.cookieToken, 'JWT ' + token, {signed: true});
                cookie.set(config.cookieSession, JSON.stringify({user: user.name, email: user.email, role: user.role}), { signed: true, httpOnly: false });
                writeToClient(response, { success: true, name: user.name, role: user.role });
                return;
            }

            writeToClient(response, null, "Error: Login Failed", HttpStatus.UNAUTHORIZED);
        });

    } catch (error) {
        writeToClient(response, null, "Error: Login Request Failed, check input data");
        debug("Login error:", error);
    }

});

/*
 * User logout - Clear JWT cookie
 */
router.get('/logout', function(request, response) {
    if(request && request.cookies) {
        var token = request.cookies[config.cookieToken];

        if(token) {
            var cookie = new Cookie(request, response, { //TODO add options for secure when server will run on HTTPS
                keys: [cookieSecret]
            });

            //Delete cookies
            cookie.set(config.cookieToken, null, { signed: true });
            cookie.set(config.cookieSession, null, { signed: true });
            return writeToClient(response, { success: true });
        }
    }

    writeToClient(response, null, "Error: User is not logged in", HttpStatus.BAD_REQUEST);
});

//FIXME handle password and remove it before sending token in email!!!
/*
 * User SignUp - create a temp account on sign up, send activation email with token
 */
router.post("/signup", function (request, response) {
    try {
        var user = JSON.parse(request.body.user);
        user.role = ROLES.GUEST;

        authUtils.signUp(user, function (error, result) {

            debug('signup result', result);
            debug('signup error', error);
            if (error) { // user data inserted successfully
                debug('signup sending error');
                return writeToClient(response, null, error, HttpStatus.BAD_REQUEST);

            }
            writeToClient(response, { success: true });
            var token = jwt.sign(user, serverSecret, { algorithm: 'HS512' });
            var link = 'http://' + request.hostname + '/api/auth/activation/' + token;
            emailUtils.activationEmail(user.email, user.name, link);
        });

    } catch (error) {
        writeToClient(response, null, "Error: Sign-Up Request Failed", HttpStatus.BAD_REQUEST);
        debug("SignUp error: ", error);
    }

});


/**
 * Account Activation route - Activate a temporary account, activation via Email with JWT
 * onerror : redirect to error page with error message
 * onsuccess : redirect to home page
 */
router.get('/activation/:token', function(request, response) {

    debug('activation token', request.params.token);
    jwt.verify(request.params.token, serverSecret, { algorithm: 'HS512' }, function(error, decoded) {
        delete decoded.createdAt;
        delete decoded.iat;
        debug('activation error', error);
        debug('activation decoded', decoded);

        if(error)
            return response.redirect(encodeURI('/error/invalid token'));

        authUtils.activateAccount(decoded, function(error, result) {
            if(error) {
                if(error.errmsg.indexOf('duplicate') !== -1)
                    return response.redirect(encodeURI('/error/account already activated'));

                return response.redirect(encodeURI('/error/account activation failed'));
            }


            debug('activation result', result);
            response.redirect('/signup/activated');
        });
    });
});

/**
 * Authenticate user - return user role if allowed, otherwise unauthorized
 */
router.get('/authenticate', function(request, response, next) {

    passport.authenticate('jwt', { session: false}, function(error, user, info) {

        debug('error', error);
        debug('user', user);
        debug('info', info);

        if(error)
            return writeToClient(response, null, error, HttpStatus.UNAUTHORIZED);

        if(!user)
            return writeToClient(response, null, info, HttpStatus.BAD_REQUEST);

        writeToClient(response, { success: true, role: user.role });
    })(request, response, next);
});

//router.get("/roles/:exec&:target&:role", function (request, response) {
//    try {
//        var role = request.params.role;
//        var executerUsername = request.params.exec;
//        var targetUsername = request.params.target;
//
//
//        authUtils.setUserRole(role, executerUsername, targetUsername, function (result) {
//            var message = "Cant change the role.";
//
//            if (result) {
//                message = result.toString();
//            }
//
//            writeToClient(response, message);
//
//
//
//        });
//
//    } catch (error) {
//        writeToClient(response, null, "Error: Roles Request Failed, check input data", HttpStatus.BAD_REQUEST);
//        debug("Roles error:", error);
//    }
//
//});

module.exports = router;
