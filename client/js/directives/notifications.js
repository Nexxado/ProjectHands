angular.module('ProjectHands')

.directive('notifications', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/notifications.html',
        controller: function($scope, $rootScope) {

            $rootScope.notifications = [];

            $scope.remove = function(index) {
                $scope.notifications.splice(index, 1);
            };
        }
    };
});
