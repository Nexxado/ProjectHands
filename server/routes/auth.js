var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var emailUtils = require('../utils/email');
var writeToClient = require('../utils/writeToClient');
var config = require('../../config.json');
var serverSecret = process.env.SERVER_SECRET || config.serverSecret;
var ROLES = config.ROLES;
var ROLES_HIERARCHY = [ROLES.GUEST, ROLES.VOLUNTEER, ROLES.TEAM_LEAD, ROLES.MANAGER, ROLES.ADMIN];


/*
 * User Login - match user password hash to hash in DB using passport strategy
 */
router.post('/login', passport.authenticate('local'), 
            function(request, response) {
    
    debug('local login success');
    debug('local login user', request.user);
    
    writeToClient(response, { success: true, name: request.user.name, email: request.user.email, role: request.user.role });
});

/*
 * returns if user is logged in
 */
router.get('/isLoggedIn', function(request, response) {
    if(request.isAuthenticated())
        return writeToClient(response, { success: true, name: request.user.name, email: request.user.email, role: request.user.role });

    return writeToClient(response, null, "Error: User is not logged in", HttpStatus.BAD_REQUEST);
});

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }), 
           function(request, response) {
    
    debug('google login success');
});


/*
 * User logout - Clear session
 */
router.get('/logout', ensureAuthenticated, function(request, response) {
    request.logout();
    return writeToClient(response, { success: true });
});


/*
 * User SignUp - create a temp account on sign up, send activation email with token
 */
router.post("/signup", function (request, response) {
    try {
        var user = JSON.parse(request.body.user);
        user.role = ROLES.ADMIN; //FIXME change initial role to ROLES.GUEST;

        authUtils.signUp(user, function (error, result) {

            debug('signup result', result);
            debug('signup error', error);
            if (error) { // user data inserted successfully
                debug('signup sending error');
                return writeToClient(response, null, error, HttpStatus.BAD_REQUEST);

            }
            writeToClient(response, { success: true });
            delete user.password; //remove password so token won't contain it
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

router.get('/authenticate/:role', isAuthorized);

/**
 * Authenticate user - return user role if allowed, otherwise unauthorized
 */
function isAuthorized(request, response, next) {
    if (request.isAuthenticated()) {

        debug('role', request.params.role);
        debug('user', request.user);

        if (ROLES_HIERARCHY.indexOf(request.user.role) <= ROLES_HIERARCHY.indexOf(request.params.role))
            return writeToClient(response, null, 'Not Allowed', HttpStatus.FORBIDDEN);

        return writeToClient(response, { success: true, role: request.user.role });
    }

    return writeToClient(response, null, 'User Not Logged In', HttpStatus.UNAUTHORIZED);
}

/**
 * Make sure user is logged in
 */
function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated())
      return next();

  return writeToClient(response, null, "Error: User is not logged in", HttpStatus.BAD_REQUEST);
}

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
