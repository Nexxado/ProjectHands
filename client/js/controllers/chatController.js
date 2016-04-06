angular.module('ProjectHands')

.controller('ChatController', function($scope, socketio) {

    $scope.isLoggedIn = false;
    $scope.login = {
        username: '',
        password: ''
    };

    $scope.room = '';
    
    $scope.chatLogin = function() {

        if ($scope.ChatLoginForm.$invalid) {
            return;
        }

        $scope.isLoggedIn = true;
        $scope.message.user = $scope.login.username;

        if($scope.room !== '') {
            socketio.emit('room.join', $scope.room);
        }
    };

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
        user: '', //TODO replace with actual user
        content: ''
    };

    $scope.sendMessage = function() {

        if ($scope.ChatMessageForm.$invalid) {
            return;
        }

        $scope.history.push({ user: $scope.message.user, content: $scope.message.content});
        socketio.emit('message', $scope.message, $scope.room, function(data) {
            console.log('Ack: ', data);
        });

        $scope.ChatMessageForm.$setPristine();
        $scope.ChatMessageForm.$setUntouched();
        $scope.message.content = '';
        // angular.element('input[name="message"]').focus();
    };

    socketio.on('message', function(message) {
        $scope.$apply(function () {
            $scope.history.push(message);
        });
    });

});