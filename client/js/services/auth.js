
angular.module('ProjectHands')

    .factory("Auth", function ($resource , $cookies) {

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
        function login(username, timeStamp,random,hashedKey) {
            var credentials={};
            credentials.username=username;
            credentials.time=timeStamp;
            credentials.random=random;

            return $resource(baseUrl + '/login/:credentials&:hash').get({credentials: JSON.stringify(credentials), hash: hashedKey});

        }

        function cookieWrite(key,value)
        {

            var now = new Date();
            now.setTime(now.getTime() +3600);
            $cookies.put(key,value ,{   expires: now });
        }
        function cookieRead(key)
        {
            return $cookies.get(key);
        }


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
            var textToBeHashed = username + time + random + password;
            var key = password;
          // create hash
            var hashedValue = CryptoJS.HmacSHA512(textToBeHashed,key);
            return hashedValue;
        }

        return {

            login: login,
            hashSha512:hashSha512,
            cookieWrite:cookieWrite,
            cookieRead:cookieRead
        };
    });