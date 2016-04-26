var JwtStrategy = require('passport-jwt').Strategy;
//var ExtractJwt = require('passport-jwt').ExtractJwt;
var debug = require('debug')('passport-strategy');
var mongoUtils = require('./utils/mongo');
var config = require('../config.json');
var USERS = config.COLLECTIONS.USERS;


var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies[config.cookieToken];
        if(token)
            token = token.split(' ')[1];
//        debug('cookieExtractor token', token);
    }
    return token;
};



module.exports = function(passport) {
    var options = {};
    options.secretOrKey = process.env.SERVER_SECRET || config.serverSecret;
//    options.jwtFromRequest = ExtractJwt.fromAuthHeader();
    options.jwtFromRequest = cookieExtractor;
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {

        debug('passport payload', jwt_payload);
        var query = {
            _id: jwt_payload._id,
            name: jwt_payload.name,
            role: jwt_payload.role,
            email: jwt_payload.email,
        };

        mongoUtils.query(USERS, query, function(error, result) {

            var user = result[0];
            debug('passport error', error);
            debug('passport user', user);

            if(error || !result)
                return done(error, false);

            if(!user)
                return done(null, false);

            done(null, user);
        });
    }));
};
