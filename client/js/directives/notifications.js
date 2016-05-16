angular.module('ProjectHands')

.directive('notifications', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/notifications.html',
        controller: function($scope, $rootScope, socketio, $timeout) {

            var duration = 5000; //5 seconds
            $scope.notifications = [];

//            for(var i = 0; i < 20; i++) {
//                $rootScope.notifications.push({
//                    timestamp: new Date().toDateString(),
//                    message: 'Lorem ipsum dolor ' + i
//                });
//            }

            $scope.dismiss = function(index) {
                if(index < 0 || index >= $scope.notifications.length)
                    return;

                $scope.notifications.splice(index, 1);
            };

            $rootScope.initNotifications = function() {
                console.log('INIT NOTIFICATIONS');
                socketio.on('notification', function(notification) {

                    $timeout(function() { //Apply message on next digest cycle
                        $scope.notifications.push(notification);
                    });

                    $timeout(function() { //Dismiss message after duration
                        $scope.dismiss($scope.notifications.indexOf(notification));
                    }, duration);
                });
            };
        }
    };
});
