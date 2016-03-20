angular.module('ProjectHands')

.directive('customFooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/custom-footer.html',
        controller: function($scope) {
            
        }
    };
});