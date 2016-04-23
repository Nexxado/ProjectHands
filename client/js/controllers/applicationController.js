angular.module('ProjectHands')

.controller('ApplicationController', function($scope, $mdToast, AuthService) {

    $scope.currentUser = null;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.setCurrentUser = function(user) {
        $scope.currentUser = user;
    };

    //Email Regex according to RFC 5322. - http://emailregex.com/
    $scope.regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    $scope.constructionToast = function (position) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('האתר תחת בניה')
            .position(position)
            .parent('#main-view')
            .capsule(true)
            .hideDelay(2000)
        );
    };
});
