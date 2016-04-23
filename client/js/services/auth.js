angular.module('ProjectHands')

.factory("AuthService", function ($resource, $cookies, $http, $q, $window) {

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
    function login(username, password, rememberMe) {

        var random = Math.floor(Math.random() * 1000000);
        var timeStamp = new Date().getTime();

        var hashedKey = hashSha512(username, password, timeStamp, random);
        var credentials = {
            email: username,
            time: timeStamp,
            random: random,
            remember: rememberMe
        };

        return $resource(baseUrl + '/login').save({
            credentials: JSON.stringify(credentials),
            hash: encodeURI(hashedKey)
        });

    }


    function signup(user) {
        return $resource(baseUrl + '/signup').save({
            user: JSON.stringify(user)
        });
    }


    /**
     * Get a saved cookie
     * @param   {string} key : The cookie's identifier
     * @returns {object}     : The cookie
     */
    function cookieRead(key) {
        return $cookies.get(key);
    }


    /**
     * used to verify the user credentials
     * same steps on the Server side
     * @param username : the username of the user
     * @param time : time stamp from the user login
     * @param random : random number to mix the numbers
     * @param password : the hash secret key
     * @return : a SHA512 key that will be compared with user hash
     * **/
    function hashSha512(username, password, time, random) {

        // generate a hash from string
        var textToBeHashed = username + time + random + password;
        var key = password;
        // create hash
        var hashedValue = CryptoJS.HmacSHA512(textToBeHashed, key);
        return hashedValue;
    }

    return {
        signup: signup,
        login: login,
        cookieRead: cookieRead
    };
});
