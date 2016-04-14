angular.module('ProjectHands')

.directive('chat', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/chat.html',
        scope: {
            user: '@',
            rooms: '@'
        },
        controller: 'ChatController'
    };
});
