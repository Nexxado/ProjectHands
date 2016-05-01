var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var debug = require('debug')('passport-strategy');
var authUtils = require('./utils/auth');
var mongoUtils = require('./utils/mongo');
var config = require('../config.json');
var USERS = config.COLLECTIONS.USERS;
var GOOGLE_CLIENT_ID = '990301468716-ubc9ojva16mhq03k1sb88k2djruph8is.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'SPUQWJcDkLyQ5FHKu_cCLCUg';


module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        debug('serializeUser: ' + JSON.stringify(user));
        
        var serialize = {
            _id: user._id,
            email: user.email,
            role: user.role
        };
        
        done(null, JSON.stringify(serialize));
    });

    passport.deserializeUser(function (serialized, done) {
        debug('deserializeUser: ' + serialized);
        
        mongoUtils.query(USERS, JSON.parse(serialized), function(error, result) {
            
            var user = result[0];
            
            done(error, user);
        });
    });
    
    
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

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/google/callback'
    }, function (accessToken, refreshToken, profile, done) {

        debug('google accessToken', accessToken);
        debug('google refreshToken', refreshToken);
        debug('google profile', profile);
        debug('google profile id', profile.id);
        debug('google profile email', profile.emails[0].value);
        debug('google profile name', profile.name.givenName, profile.name.familyName);

        mongoUtils.query(USERS, {
            googleId: profile.id
        }, function (error, result) {

            debug('google query error', error);
            debug('google query result', result);

            var user = result[0];

            if (error)
                return done(error, false);

            if (user)
                return done(null, user);
            else {
                var newUser = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.name.givenName + ' ' + profile.name.familyName
                };
                //TODO add new user to signups
                //let user add details like id, before adding to permanent database
                return done(null, newUser);
            }
        });
    }));
};
