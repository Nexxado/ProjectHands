angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, $cookies) {

    var cookieKey = "session";

    this.startSession = function () {

        var userInfo = $cookies.getObject(cookieKey);
        if(!userInfo) {
            this.clearSession();
            return;
        }

        $rootScope.isLoggedIn = true;
        $rootScope.userName = userInfo.name;
        $rootScope.userEmail = userInfo.email;
    };

    this.clearSession = function () {
        $rootScope.isLoggedIn = false;
        $rootScope.userName = null;
        $rootScope.userEmail = null;
    };

    this.getSession = function () {
        var userInfo = $cookies.getObject(cookieKey);
        if(!userInfo) {
            this.clearSession();
            return false;
        }

        $rootScope.isLoggedIn = true;
        $rootScope.userName = userInfo.name;
        $rootScope.userEmail = userInfo.email;
        return true;
    };
});
