angular.module('ProjectHands')

.directive('dashboardSidenavAdmin', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/dashboard-sidenav-admin.html',
        controller: function($scope) {
            
        }
    };
});
