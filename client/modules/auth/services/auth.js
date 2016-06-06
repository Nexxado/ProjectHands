angular.module('ProjectHands.auth')

    .factory("AuthService", function ($rootScope, $resource, $cookies, $q, AUTH_EVENTS, UtilsService) {

        var baseUrl = '/api/auth';

        /**
         * User Login
         * @param username
         * @param password
         * @param rememberMe
         * @returns {Promise}
         */
        function login(username, password, rememberMe) {
            var deferred = $q.defer();


            $resource(baseUrl + '/login').save({
                email: username,
                password: password
            })
                .$promise
                .then(function (result) {
                    deferred.resolve(result);

                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        /**
         * Check if a user has an active session on the server
         * @returns {Promise}
         */
        function isLoggedIn() {
            return $resource(baseUrl + '/isLoggedIn').get();
        }

        /**
         * Terminate current session
         */
        function logout() {
            $resource(baseUrl + '/logout').get().$promise
                .then(function (result) {
                    console.log(result);
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

                })
                .catch(function (error) {
                    console.log(error);
                    UtilsService.makeToast('יציאה נכשלה', $rootScope.rootToastAnchor, 'top right');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                });
        }

        /**
         *
         * @param user : Object with the user's data
         * @returns {Promise}
         */
        function signup(user) {
            return $resource(baseUrl + '/signup').save({
                user: JSON.stringify(user)
            });
        }

        /**
         * Complete sign-up process when using OAuth authentication
         * @param info
         * @returns {Promise}
         */
        function oauthSignup(info) {
            return $resource(baseUrl + '/signup_oauth').save({
                info: JSON.stringify(info)
            });
        }

        /**
         * Check if a user is allowed to perform action based on it's role
         * @param action : String
         * @returns {Promise} rejected or resolved based on user's permissions
         */
        function authenticate(action) {
            return $resource(baseUrl + '/authenticate/:action').get({action: action});
        }

        /**
         * Reset user password
         * @param email
         * @param newPassword
         * @returns {Promise}
         */
        function resetPassword(email,newPassword) {
            return $resource(baseUrl + '/forgot').save({
                email: email,
                new_password:newPassword,
                old_password:""
            });

        }

        /**
         * Change user password
         * @param email
         * @param newPassword
         * @param oldPassword
         * @returns {*|{method}|Promise|Session}
         */
        function changePassword(email,newPassword,oldPassword) {
            return $resource(baseUrl + '/forgot').save({
                email: email,
                new_password:newPassword,
                old_password:oldPassword
            });

        }

        /**
         * Checks if a 9 Digit ID is a legal Israeli ID
         * @param   {string}  id : 9 digit ID number as string
         * @returns {boolean} : true if legal ID, otherwise false
         * Algorithm:
         * 1) Multiply each ID digit with each corrsponding ID of the check number
         * 2) For any result with 2 digits, add the digits together
         * 3) Sum all the resulting numbers, if the sum is divisble by 10, its legal.
         */
        // function isLegalID(id) {
        //
        //     var check = "121212121";
        //     var array = [];
        //     var sum = 0;
        //
        //     for(var i =  0; i < id.length; i++) {
        //         var result = parseInt(id.charAt(i)) * parseInt(check.charAt(i));
        //         array.push(result);
        //     }
        //
        //     for(var i = 0; i < array.length; i++) {
        //         if(array[i] >= 10) {
        //             var numStr = array[i].toString();
        //             var result = parseInt(numStr.charAt(0)) + parseInt(numStr.charAt(1));
        //             array[i] = result;
        //         }
        //     }
        //
        //     for(var i = 0; i < array.length; i++) {
        //         sum += array[i];
        //     }
        //
        //
        //     return !(sum % 10);
        // }


        return {
            signup: signup,
            oauthSignup: oauthSignup,
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout,
            authenticate: authenticate,
            resetPassword : resetPassword,
            changePassword:changePassword
            // isLegalID: isLegalID
        };
    });