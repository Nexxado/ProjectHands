var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var debug = require('debug')('passport-strategy');
var authUtils = require('./utils/auth');
var mongoUtils = require('./utils/mongo');
var config = require('../config.json');
var ROLES = config.ROLES;
var USERS = config.COLLECTIONS.USERS;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || config.AUTH.google_client_id;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || config.AUTH.google_client_secret;
var GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK || config.AUTH.google_callback;
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || config.AUTH.facebook_app_id;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || config.AUTH.facebook_app_secret;
var FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK || config.AUTH.facebook_callback;


module.exports = function (passport) {

    /**
     * Serialize user into session
     */
    passport.serializeUser(function (user, done) {
        debug('serializeUser: ' + JSON.stringify(user));
        
        var serialize = {
            email: user.email,
            role: user.role
        };
        
        done(null, JSON.stringify(serialize));
    });

    /**
     * Deserialize user from session
     */
    passport.deserializeUser(function (serialized, done) {
        debug('deserializeUser: ', JSON.parse(serialized));
        var deserialized = JSON.parse(serialized);
        var query = {
            email: deserialized.email
        };
        
        mongoUtils.query(USERS, query, function(error, result) {

            if(!result || !result[0]) //User not found - Terminate session.
                return done(error, false);

            var user = result[0];
            debug('deserializeUser query error', error);
            debug('deserializeUser query user', user);
            done(error, user);
        });
    });
    
    
    /**
     * Strategy used for local login
     */
    passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
        
        debug('local email', email);
        debug('local password', password);
        
        authUtils.login(email, password, function(error, user) {
            
            if(error)
                return done(error);
            
            if(!user)
                return done(null, false);
            
            return done(null, user);
        });
    }));

    /**
     * Strategy used for Google Social sign in
     */
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
    }, function (accessToken, refreshToken, profile, done) {

        debug('google accessToken', accessToken);
        debug('google refreshToken', refreshToken);
        debug('google profile', profile);

        mongoUtils.query(USERS, {email: profile.emails[0].value}, function (error, result) {

            debug('google query error', error);
            debug('google query result', result);

            var user = result[0];

            if (error)
                return done(error, false);

            if (user) {

                if(!user.googleId) {
                    user.googleId = profile.id;

                    mongoUtils.update(USERS, { email: user.email }, {$set: {googleId: profile.id}}, {}, function(error, result) {
                        debug('google updated user id');
                        debug('error', error);
                        debug('result', result);
                    });
                }

                return done(null, user);

            } else {  // create new user
                var newUser = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    role: ROLES.GUEST,
                    signup_complete: false,
                    approved: false,
                    joined_date: new Date()
                };

                mongoUtils.insert(USERS, newUser, function(error, result) {

                    debug('google newUser error', error);
                    debug('google newUser result', result);

                    if (error)
                        return done(error, false);

                    var user = result.ops[0];

                    return done(null, user);
                });
            }
        });
    }));

    /**
     * Strategy used for Facebook Social sign in
     */
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'name', 'email']
    }, function (accessToken, refreshToken, profile, done) {

        debug('facebook accessToken', accessToken);
        debug('facebook refreshToken', refreshToken);
        debug('facebook profile', profile);

        mongoUtils.query(USERS, {email: profile.emails[0].value}, function (error, result) {

            debug('facebook query error', error);
            debug('facebook query result', result);

            var user = result[0];

            if (error)
                return done(error, false);

            if (user) {

                if(!user.facebookId) {
                    user.facebookId = profile.id;

                    mongoUtils.update(USERS, { email: user.email }, {$set: {facebookId: profile.id}}, {}, function(error, result) {
                        debug('facebook updated user id');
                        debug('error', error);
                        debug('result', result);
                    });
                }

                return done(null, user);

            } else { // create new user
                var newUser = {
                    facebookId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    role: ROLES.GUEST,
                    signup_complete: false,
                    approved: false,
                    joined_date: new Date()
                };

                mongoUtils.insert(USERS, newUser, function(error, result) {

                    debug('google newUser error', error);
                    debug('google newUser result', result);

                    if (error)
                        return done(error, false);

                    var user = result.ops[0];

                    return done(null, user);
                });
            }
        });

    }));
};
