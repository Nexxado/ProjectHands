angular.module('ProjectHands')

.controller('ChatController', function($scope, $attrs, $timeout) {
    
    $scope.user = $attrs.user;
    $timeout(function() {
        $scope.rooms = $attrs.rooms.split(','); //FIXME Delete split() and $timeout() after finishing development
    });
    console.log('user', $scope.user);
    console.log('rooms', $scope.rooms);

});
