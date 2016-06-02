angular.module('ProjectHands')

    .directive('profile', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/profile.html',
            controller: function ($scope, AuthService) {

                $scope.profile ;
                AuthService.isLoggedIn().$promise
                    .then(function (result) {
                        $scope.profile = result;
                        console.log('getSession result', result);
                    })
                    .catch(function (error) {
                        console.log('isLoggedIn error', error);
                    });
            }
        };
    });
