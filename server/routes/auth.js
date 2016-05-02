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
    
    debug('google login success', request.user);

    if (ROLES_HIERARCHY.indexOf(request.user.role) < ROLES_HIERARCHY.indexOf(ROLES.VOLUNTEER))
        return response.redirect('/home');
    else
        return response.redirect('/dashboard');
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signup' }),
           function(request, response) {

    debug('google login success', request.user);

    if (ROLES_HIERARCHY.indexOf(request.user.role) < ROLES_HIERARCHY.indexOf(ROLES.VOLUNTEER))
        return response.redirect('/home');
    else
        return response.redirect('/dashboard');
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

        debug('signup user', user);
        delete user._id; //TODO check why user is receieved with _id = ''

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

router.get('/authenticate/:role', isAuthorized());

/**
 * Authenticate user - return user role if allowed, otherwise unauthorized
 */
function isAuthorized(role) {

    return function(request, response, next) {
        if (request.isAuthenticated()) {

            debug('isAuthorized request role', request.params.role);
            debug('isAuthorized argument role', role);
            debug('isAuthorized user', request.user);

            var roleIndex = role ? ROLES_HIERARCHY.indexOf(role) : ROLES_HIERARCHY.indexOf(request.params.role);

            if (ROLES_HIERARCHY.indexOf(request.user.role) <= roleIndex)
                return writeToClient(response, null, 'Not Allowed', HttpStatus.FORBIDDEN);

            return writeToClient(response, { success: true, role: request.user.role });
        }

        return writeToClient(response, null, 'User Not Logged In', HttpStatus.UNAUTHORIZED);
    };
}

/**
 * Make sure user is logged in
 */
function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated())
      return next();

  return writeToClient(response, null, "Error: User is not logged in", HttpStatus.BAD_REQUEST);
}


router.post('/assignrole', isAuthorized(ROLES.ADMIN), function(request, response, next) {

    if(!request.body.user || !request.body.newrole)
        return writeToClient(response, 'No user or new role provided', HttpStatus.BAD_REQUEST);

    var user = JSON.parse(request.body.user);
    var newRole = request.body.newrole;

    authUtils.setUserRole(user, newRole, function(error, result) {

        if(error)
            return writeToClient(response, null, error, HttpStatus.INTERNAL_SERVER_ERROR);

        debug('assignrole setUserRole error', error);
        debug('assignrole setUserRole result', result);
        writeToClient(response, result);
    });

});


module.exports = router;
