angular.module('ProjectHands')

.directive('notifications', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/notifications.html',
        controller: function($scope, $rootScope) {

            $rootScope.notifications = [];

//            for(var i = 0; i < 20; i++) {
//                $rootScope.notifications.push({
//                    timestamp: new Date().toDateString(),
//                    message: 'Lorem ipsum dolor ' + i
//                });
//            }

            $scope.dismiss = function(index) {
                $scope.notifications.splice(index, 1);
            };
        }
    };
});
