angular.module('ProjectHands.auth')

.service('SessionService', function ($window, $rootScope) {

    var isLoggedKey = "isLogged";
    var userInfoKey = "userInfo";

    this.startSession = function (userName) {
        $rootScope.isLoggedIn = true;
        $rootScope.userName = userName;
        $window.sessionStorage[isLoggedKey] = true;
        $window.sessionStorage[userInfoKey] = userName;
    };

    this.clearSession = function () {
        $rootScope.isLoggedIn = false;
        $window.sessionStorage[isLoggedKey] = '';
        $window.sessionStorage[userInfoKey] = '';
    };

    this.getSession = function () {
        $rootScope.isLoggedIn = $window.sessionStorage[isLoggedKey];
        $rootScope.userName = $window.sessionStorage[userInfoKey];
    };
});
