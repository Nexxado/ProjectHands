angular.module('ProjectHands.auth')

.factory("AuthService", function ($rootScope, $resource, $cookies, $q, AUTH_EVENTS, UtilsService) {

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

    function signup(user) {
        return $resource(baseUrl + '/signup').save({
            user: JSON.stringify(user)
        });
    }

    function authenticate(route) {
        return $resource(baseUrl + '/authenticate/:route').get({route: route});
    }
    

    return {
        signup: signup,
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        authenticate: authenticate
    };
});
