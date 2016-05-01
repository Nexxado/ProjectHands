angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, AuthService) {

    this.clearSession = function () {
        $rootScope.isLoggedIn = false;
        $rootScope.userName = null;
        $rootScope.userEmail = null;
    };

    this.getSession = function () {
        AuthService.isLoggedIn().$promise
            .then(function(result) {
                $rootScope.isLoggedIn = true;
                $rootScope.userName = result.name;
                $rootScope.userEmail = result.email;
                return true;
            })
            .catch(function(error) {
                console.log('isLoggedIn error', error);
                return false;
            });


    };
});
