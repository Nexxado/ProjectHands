angular.module('ProjectHands')

.directive('dashboardToolbar', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/dashboard/dashboard-toolbar.html',
        controller: function($scope) {
            
        }
    };
});
