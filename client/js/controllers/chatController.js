angular.module('ProjectHands')

    .controller('ChatController', function ($scope, socketio, APIService) {

        $scope.isLoggedIn = false;
        $scope.room = '';
        $scope.history = [];
        $scope.login = {
            username: '',
            password: ''
        };
        $scope.message = {
            user: '',
            content: '',
            timestamp: ''
        };

        $scope.chatLogin = function () {

            if ($scope.ChatLoginForm.$invalid) {
                return;
            }
            $scope.isLoggedIn = true;
            $scope.message.user = $scope.login.username;

            //Join room
            if ($scope.room !== '') {
                socketio.emit('room.join', $scope.room);
            } else {
                $scope.room = 'general';
            }

            //Get chat history
            APIService.chat($scope.room).query({room: $scope.room}, function(chat) {
                if(chat.length > 0)
                    $scope.history = chat[0].messages;

            } , function(error) {
                console.log('chat query error', error);
            });
        };


        $scope.sendMessage = function () {

            if ($scope.ChatMessageForm.$invalid) {
                return;
            }

            $scope.message.timestamp = new Date();
            $scope.history.push(angular.copy($scope.message));

            socketio.emit('message', $scope.message, $scope.room, function (data) {
                console.log('Ack: ', data);
            });

            //reset form
            $scope.ChatMessageForm.$setPristine();
            $scope.ChatMessageForm.$setUntouched();
            $scope.message.content = '';
            // angular.element('input[name="message"]').focus();
        };

        socketio.on('message', function (message) {
            $scope.$apply(function () {
                $scope.history.push(message);
            });
        });
    });