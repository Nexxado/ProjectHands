angular.module('ProjectHands')

.controller('ChatController', function($scope, socketio) {
    
    $scope.history = [
        {
            user: 'Netanel',
            content: 'Hi there'
        } , {
            user: 'Dan',
            content: 'heyyy!'
        }
    ];

    $scope.message = {
        user: 'Netanel', //TODO replace with actual user
        content: ''
    };

    $scope.sendMessage = function() {
        $scope.history.push({ user: $scope.message.user, content: $scope.message.content});
        socketio.emit('message', $scope.message, function(data) {
            console.log('Ack: ', data);
        });

        $scope.message.content = '';
    };

    socketio.on('message', function(message) {
        $scope.$apply(function () {
            $scope.history.push(message);
        });
    });

});