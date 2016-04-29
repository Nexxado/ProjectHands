/**
 * Created by DarKingDooM on 4/18/2016.
 */

/**
 * The matter of this UserUtils is to provide a set of tools for managing users such :
 * 1- Login
 * 2- signup
 * 3- cookies
 * {@link Diagram Link}
 *
 *
 * */


var crypto = require('crypto');
var mongoUtils = require('./mongo');
var debug = require('debug')('utils/auth');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var ROLES = config.ROLES;

var bcrypt = require('bcrypt');
var saltRounds = 10; // will do 2^rounds

/**
 * Defines the Roles that are in the system
 * @type {{ADMIN: string, MANAGER: string, TEAM_LEAD: string, VOLUNTEER: string}}
 */

/**
 * used to verify the user credentials
 * same steps on the Client side
 * @param username : the username of the user
 * @param time : time stamp from the user login
 * @param random : random number to mix the numbers
 * @param password : the hash secret key
 * @return : a SHA512 key that will be compared with user hash
 * **/
function hashSha512(username, time, random, password) {
    // generate a hash from string <textToBeHashed>
    var textToBeHashed = username + time + random + password;
    var key = password;
    // create hash
    var hashObj = crypto.createHmac('sha512', key);
    hashObj.update(textToBeHashed);
    var hashedValue = hashObj.digest('hex');
    return hashedValue;
}

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
    setUserRole: function (role, executerUsername, targetUsername, callback) {
        //we need to check that who sent the request has admin role
        mongoUtils.query(COLLECTIONS.USERS, { email: executerUsername }, function (result) {
            if (result || result.length === 1) {
                var executerPermission = result[0].role;
                // if targetUsername dose not  exist , nothing will be changed
                if (executerPermission === ROLES.ADMIN) {
                    mongoUtils.update(COLLECTIONS.USERS,
                                      { email: targetUsername }, 
                                      { $set: { role: role } },
                                      {}, 
                                      callback);
                    return;
                }
            }
            callback(null);
        });
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
        mongoUtils.query(COLLECTIONS.USERS, { $or: [{ email: user.email }, { _id: user._id }] }, function(error, result) {
            if(result && result.length)
                return callback({ errMessage: "Account Already Exists" }, null);

            user.createdAt = new Date();

            bcrypt.hash(user.password, saltRounds, function(error, hash) {

                debug('bcrypt hash error', error);
                debug('bcrypt hash hash', hash);
                if(error)
                    return callback({ errMessage: "Failed to hash password" }, null);

                user.password = hash;
                mongoUtils.insert(COLLECTIONS.SIGNUPS, user, callback);
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
    login: function (credentials, callback) {
        
        debug('Login credentials', credentials);
        
        mongoUtils.query(COLLECTIONS.USERS, { email: credentials.email }, function (error, result) {

            if(error)
                return callback(error, result);

            if(result.length > 1)
                return callback("Found more than 1 user", null);

            debug('login query result', result);
            var user = result[0];

            bcrypt.compare(credentials.password, user.password, function(error, result) {
                
                debug('bcrypt compare error', error);
                debug('bcrypt compare result', result);

                if(!result)
                    user = null;

                callback(error, user);
            });
        });
    }
};
