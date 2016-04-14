angular.module('ProjectHands')

.directive('chatRoom', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/chat-room.html',
        scope: {
            room: '@',
            user: '@'
        },
        controller: 'ChatRoomController'
    };
});
