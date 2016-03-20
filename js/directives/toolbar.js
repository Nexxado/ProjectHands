angular.module('ProjectHands')

.directive('toolbar', function () {
    return {
        restrict: 'E',
        replace: true,
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
