angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, AuthService) {

    var cookieKey = "session";

//    this.startSession = function () {
//
//        var userInfo = $cookies.getObject(cookieKey);
//        if(!userInfo) {
//            this.clearSession();
//            return;
//        }
//
//        $rootScope.isLoggedIn = true;
//        $rootScope.userName = userInfo.name;
//        $rootScope.userEmail = userInfo.email;
//    };

    this.clearSession = function () {
        $rootScope.isLoggedIn = false;
        $rootScope.userName = null;
        $rootScope.userEmail = null;
    };

    this.getSession = function () {
//        var userInfo = $cookies.getObject(cookieKey);
//        if(!userInfo) {
//            this.clearSession();
//            return false;
//        }
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
