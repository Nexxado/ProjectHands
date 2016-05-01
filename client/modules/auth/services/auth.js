angular.module('ProjectHands.auth')

.factory("AuthService", function ($resource, $cookies, $q) {

    var baseUrl = '/api/auth';

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

    function isLoggedIn() {
        return $resource(baseUrl + '/isLoggedIn').get();
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
    

    return {
        signup: signup,
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        authenticate: authenticate
    };
});