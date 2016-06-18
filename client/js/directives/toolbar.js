angular.module('ProjectHands')

.directive('toolbar', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/toolbar.html',
        controller: function ($scope, AuthService, ROLES, $mdMedia) {
            
            var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) {
                return ROLES[key];
            }).reverse();

            $scope.logout = AuthService.logout;

            $scope.hasDashboardAccess = function() {
                return ROLES_HIERARCHY.indexOf($scope.user.role) >= ROLES_HIERARCHY.indexOf(ROLES.ADMIN);
            };

            $scope.showNextRenovation = function() {
                return $scope.user && $scope.user.renovation && ROLES_HIERARCHY.indexOf($scope.user.role) >= ROLES_HIERARCHY.indexOf(ROLES.VOLUNTEER);
            };
			
        }
    };
});
