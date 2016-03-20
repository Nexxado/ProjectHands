angular.module('ProjectHands')

.directive('toolbar', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/toolbar.html',
        controller: function ($scope) {
            $scope.inputUsername = '';
            $scope.inputPassword = '';

            $scope.login = function () {

                $scope.LoginForm.$setPristine();
                $scope.inputUsername = '';
                $scope.inputPassword = '';

            };
        }
    };
});
