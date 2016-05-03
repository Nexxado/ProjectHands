angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, AuthService, AUTH_EVENTS) {

    this.clearSession = function () {
        $rootScope.isLoggedIn = false;
        $rootScope.userName = null;
        $rootScope.userEmail = null;
    };

    this.getSession = function () {
        AuthService.isLoggedIn().$promise
            .then(function(result) {
                console.log('getSession result', result);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {userName: result.name, role: result.role});
                $rootScope.isLoggedIn = true;
                $rootScope.userName = result.name;
                $rootScope.userEmail = result.email;
            })
            .catch(function(error) {
                console.log('isLoggedIn error', error);
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            });
    };
});
