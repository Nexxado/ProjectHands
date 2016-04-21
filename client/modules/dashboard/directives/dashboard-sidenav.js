angular.module('ProjectHands.dashboard')

.directive('dashboardSidenav', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/dashboard/templates/directives/dashboard-sidenav.html',
        controller: function($scope) {
            
        }
    };
});
