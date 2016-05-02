var mongoUtils = require('./mongo');
var debug = require('debug')('utils/auth');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var ROLES = config.ROLES;

var bcrypt = require('bcrypt');
var saltRounds = 10; // will do 2^rounds


module.exports = {

    /**
     * The roles passed to export
     * @link Roles : contains the Roles in the system
     */
    roles: ROLES,

    /**
     * This method will change the user role
     * @param role : the role that we wan to assign to this person
     * @param executerUsername : who issued the role change
     * @param targetUsername : the user that his role will be changed
     * @link  mongoUtils.update : to update the targetUsername role
     * @link mongoUtils.query : to check the  executerUsername role
     */
    setUserRole: function (user, newRole, callback) {
        //we need to check that who sent the request has admin role
        mongoUtils.update(COLLECTIONS.USERS, user, {$set: {role: newRole}}, {}, callback);
    },

    /**
     * Insert a user to the DataBase
     * @param user : the user details from the Client
     * @param callback : methods will be executed when the user is inserted(Success/Fail)
     */
    signUp: function (user, callback) {

        //Set TTL on collection's documents with field "createdAt"
        mongoUtils.getCollection(COLLECTIONS.SIGNUPS).ensureIndex({ "createdAt": 1 },
                                                                  { expireAfterSeconds: 86400 }, // 24 hours
                                                                 function(error, indexName) {
            debug('ensureIndex indexName', indexName);
            debug('ensureIndex error', error);
        });


        //Check if user already exists
        mongoUtils.query(COLLECTIONS.USERS, { email: user.email }, function(error, result) {
            if(result && result.length)
                return callback({ errMessage: "Account Already Exists" }, null);

            //Check if user already signed up
            mongoUtils.query(COLLECTIONS.SIGNUPS, { email: user.email }, function(error, result) {
                if(result && result.length)
                    return callback({errMessage: "Account Already Signed up"}, null);


                user.createdAt = new Date();

                bcrypt.hash(user.password, saltRounds, function(error, hash) {

                    debug('bcrypt hash error', error);
                    debug('bcrypt hash hash', hash);
                    if(error)
                        return callback({ errMessage: "Failed to hash password" }, null);

                    user.password = hash;
                    user.approved = false;
                    mongoUtils.insert(COLLECTIONS.SIGNUPS, user, callback);
                });
            });
        });
    },


    /**
     * Activate a temporary user account
     * @param   {object}   user     : Object with the user details
     * @param   {function} callback : Function to be executed on completion
     */
    activateAccount: function(user, callback) {
        mongoUtils.delete(COLLECTIONS.SIGNUPS, user, function(error, result) {
            if(error)
                debug('Failed to delete user from signups');
            else
                debug('deleted user from signups');
        });

        mongoUtils.insert(COLLECTIONS.USERS, user, callback);
    },


    /**
     * Gives a Allowed/NotAllowed for user to login
     * @link hashSha512 : to generated the hash value from the server side
     * @param credentials : the username , time(the request sent time) , key(random number)
     * @param key : the user hash value that been generated from the Client side
     * @param callback : the function that the data will be sent to
     */
    login: function (email, password, callback) {
        
        debug('Login email', email);
        debug('Login password', password);
        
        
        mongoUtils.query(COLLECTIONS.USERS, { email: email }, function (error, result) {

            if(error)
                return callback(error, result);

            if(result.length > 1)
                return callback("Found more than 1 user", null);

            debug('login query result', result);
            var user = result[0];

            bcrypt.compare(password, user.password, function(error, result) {
                
                debug('bcrypt compare error', error);
                debug('bcrypt compare result', result);

                if(!result)
                    user = null;

                callback(error, user);
            });
        });
    }
};
