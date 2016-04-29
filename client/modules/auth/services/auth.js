angular.module('ProjectHands.auth')

.factory("AuthService", function ($resource, $cookies, $q) {

    var baseUrl = '/api/auth';
    var cookieTokenKey = "token";

    function login(username, password, rememberMe) {
        var deferred = $q.defer();

        var credentials = {
            email: username,
            password: password,
            remember: rememberMe
        };

        $resource(baseUrl + '/login').save({
                credentials: JSON.stringify(credentials)
            })
            .$promise
            .then(function (result) {
//                console.log('result', result);
                deferred.resolve(result);

            }, function (error) {
//                console.log('error', error);
                deferred.reject(error);
            });

        return deferred.promise;
    }


    function logout() {
        return $resource(baseUrl + '/logout').get();
    }

    function signup(user) {
        return $resource(baseUrl + '/signup').save({
            user: JSON.stringify(user)
        });
    }

    function authenticate(authorizedRole) {
        return $resource(baseUrl + '/authenticate/:role').get({role: authorizedRole});
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
        logout: logout,
        authenticate: authenticate,
        cookieRead: cookieRead
    };
});
