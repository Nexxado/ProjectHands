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


var crypto = require('crypto-js');
var mongoUtils = require('./mongo');


/**
 * Defines the Roles that are in the system
 * @type {{ADMIN: string, MANAGER: string, TEAM_LEAD: string, VOLUNTEER: string}}
 */
const Roles={
    ADMIN:"admin",
    MANAGER:"manager",
    TEAM_LEAD:"teamLead",
    VOLUNTEER : "volunteer"
};

/**
 * used to verify the user credentials
 * same steps on the Client side
 * @param username : the username of the user
 * @param time : time stamp from the user login
 * @param random : random number to mix the numbers
 * @param password : the hash secret key
 * @return : a SHA512 key that will be compared with user hash
 * **/
function hashSha512(username,time,random,password)
{
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
    roles : Roles,

    /**
     * This method will change the user role
     * @param role : the role that we wan to assign to this person
     * @param executerUsername : who issued the role change
     * @param targetUsername :the user that his role will be changed
     * @link  mongoUtils.update : to update the targetUsername role
     * @link mongoUtils.query : to check the  executerUsername role
     */
    setUserRole:function(role ,executerUsername,targetUsername,callback)
    {
        //we need to check that who sent the request has admin role
        mongoUtils.query("users",{username : executerUsername},function (result) {
            if(result != null || result.length ==1 )
            {
                var executerPermission= result[0].role;
                // if targetUsername dose not  exist , no thing will be changed
                if(executerPermission==Roles.ADMIN)
                {
                        mongoUtils.update("users",{username:targetUsername},{$set: { role:role }},{},callback);
                        return;

                }
            }

            callback(null);



        });

    },

    /**
     * Insert a user to the DataBase
     * @param userObject : the user details from the Client
     * @param callback : methods will be executed when the user is inserted(Success/Fail)
     */
    signUp: function(userObject , callback)
    {
        mongoUtils.insert("users",userObject,callback);
    },




    /**
     * Gives a Allowed/NotAllowed for user to login
     * @link hashSha512 : to generated the hash value from the server side
     * @param credentials : the username , time(the request sent time) , key(random number)
     * @param key : the user hash value that been generated from the Client side
     * @param callback : the function that the data will be sent to
     */
    login : function (credentials ,key, callback) {
        mongoUtils.query("users",{username:credentials.username},function (result) {
            var msgAndToken={isAllowed:"Not Allowed",token:""}; // the final result to the user
            // the result is array ,the matching user should be at 0, so we will fetch the password
            if(result.length==1 && result[0].password!==undefined)// exactly 1 match and the password exists
            {
                var password = result[0].password; // the password attribute
                // now we want to do the has
                var hashResult = hashSha512(credentials.username,credentials.time,credentials.random,password);
                // now id the has var is equal to hashResult user is allowed to login
                if(hashResult === key)
                {
                    var token = hashSha512(credentials.username,"50:99",credentials.random,password);
                    msgAndToken={isAllowed:"Allowed",token:token};
                }


            }
           callback(msgAndToken);

        });

    }

    
}

