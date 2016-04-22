angular.module('ProjectHands')

.factory("Auth", function ($resource, $cookies) {

    var baseUrl = '/api/auth';


    /**
     *
     * sends login request to the server api and receives a hash in the result
     * @param username : the user username
     * @param timeStamp : the time of the request
     * @param key :  the user password
     * @param hash : the sha512 hmac key
     * @returns {*}
     */
    var login = function (username, password) {
        
        var random = Math.floor(Math.random() * 1000000);
        var timeStamp = new Date().getTime();
        
        var hashedKey = hashSha512(username, password, timeStamp, random);
        
        var credentials = {
            username: username,
            time: timeStamp,
            random: random
        };

        return $resource(baseUrl + '/login/:credentials&:hash').get({
            credentials: JSON.stringify(credentials),
            hash: hashedKey
        });

    };


    var cookieRead = function (key) {
        return $cookies.get(key);
    };


    /**
     * used to verify the user credentials
     * same steps on the Server side
     * @param username : the username of the user
     * @param time : time stamp from the user login
     * @param random : random number to mix the numbers
     * @param password : the hash secret key
     * @return : a SHA512 key that will be compared with user hash
     * **/
    var hashSha512 = function (username, password, time, random) {
        
        // generate a hash from string
        var textToBeHashed = username + time + random + password;
        var key = password;
        // create hash
        var hashedValue = CryptoJS.HmacSHA512(textToBeHashed, key);
        return hashedValue;
    };

    return {
        login: login,
        hashSha512: hashSha512,
        cookieRead: cookieRead
    };
});
