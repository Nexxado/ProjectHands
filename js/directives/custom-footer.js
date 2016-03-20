angular.module('ProjectHands')

.directive('customFooter', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/custom-footer.html',
        controller: function($scope) {
            
        }
    };
});
