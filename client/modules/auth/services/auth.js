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
    function changePassword(email, oldPassword, newPassword) {
        return $resource(baseUrl + '/forgot').save({
            email: email,
            new_password:newPassword,
            old_password:oldPassword
        });

    }

    /**
     *  Changes user email address
     * @param oldEmail : the email to be changed
     * @param newEmail : the email to be used
     * @returns {*|{method}|Promise|Session}
     */
    function changeEmailRequest(oldEmail, newEmail) {
        return $resource(baseUrl + '/changeEmailRequest').save({
            oldEmail: oldEmail,
            newEmail: newEmail
        });

    }
    

    return {
        signup: signup,
        oauthSignup: oauthSignup,
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        authenticate: authenticate,
        resetPassword : resetPassword,
        changePassword:changePassword,
        changeEmailRequest: changeEmailRequest
    };
});
