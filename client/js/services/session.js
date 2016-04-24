angular.module('ProjectHands')

.service('SessionService', function ($window, $rootScope) {

    var isLoggedKey = "isLogged";

    this.startSession = function () {
        $rootScope.isLoggedIn = true;
        $window.sessionStorage[isLoggedKey] = true;
    };

    this.endSession = function () {
        $rootScope.isLoggedIn = false;
        $window.sessionStorage[isLoggedKey] = '';
    };

    this.getSession = function () {
        $rootScope.isLoggedIn = $window.sessionStorage[isLoggedKey];
    };
});
