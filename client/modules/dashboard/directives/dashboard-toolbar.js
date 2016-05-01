angular.module('ProjectHands.dashboard')

.directive('dashboardToolbar', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/dashboard/templates/directives/dashboard-toolbar.html',
        controller: function($scope) {
            
        }
    };
});
