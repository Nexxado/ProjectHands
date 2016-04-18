/**
 * Created by DarKingDooM on 4/18/2016.
 */
/**
 * The matter of this Utils is to provide a set of tools for managing users such :
 * 1- Login
 * 2- signup
 * 3- session
 * {@link Diagram Link}
 *
 *
 * */
var crypto = require('crypto');
var mongoUtils = require('./mongoUtils');

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
// generate a hash from string
    text = username + time + random + password;
    var key = password;
// create hash
    var hash = crypto.createHmac('sha512', key);
    hash.update(text);
    var value = hash.digest('hex');
    return value;
}
module.exports = {

    /**
     * Gives a Allowed/NotAllowed for user to login
     * @link hashSha512 : to generated the hash value from the server side
     * @param credentials : the username , time(the request sent time) , key(random number)
     * @param key : the user hash value that been generated from the Client side
     * @param callback : the function that the data will be sent to
     */
    login : function (credentials ,key, callback) {
        mongoUtils.query("users",{username:credentials.username},function (result) {
            var isAllowed="Not Allowed"; // the final result to the user
            // the result is array ,the matching user should be at 0, so we will fetch the password
            if(result.length==1 && result[0].password!==undefined)// exactly 1 match and the password exists
            {
                var password = result[0].password; // the password attribute
                // now we want to do the has
                var hashResult = hashSha512(credentials.username,credentials.time,credentials.key,password);
                // now id the has var is equal to hashResult user is allowed to login
                if(hashResult === key)
                {
                    isAllowed="Allowed";
                }


            }
           callback(isAllowed);

        });

    }

    
}

