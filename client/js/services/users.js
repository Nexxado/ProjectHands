
angular.module('ProjectHands')

    .factory("UsersService", function ($resource) {

        var baseUrl = '/users';



        function login(username, timeStamp,key,hash) {
            var credentials={};
            credentials.username=username;
            credentials.time=timeStamp;
            credentials.key=key;

            return $resource(baseUrl + '/login/:credentials&:hash').get({credentials: JSON.stringify(credentials), hash: hash});

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
            text = username + time + random + password;
            var key = password;
          // create hash
            //var val1 = CryptoJS.HmacSHA512("sdasd");
            var value=CryptoJS.HmacSHA512(text,key);
            return value;
        }

        return {

            login: login,
            hashSha512:hashSha512
        };
    });