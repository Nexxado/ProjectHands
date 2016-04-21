angular.module('ProjectHands.dashboard')

.directive('dashboardSidenavAdmin', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/dashboard/templates/directives/dashboard-sidenav-admin.html',
        controller: function($scope) {
            
        }
    };
});
