angular.module('ProjectHands')

    .controller('ChatController', function ($scope, socketio, APIService) {

        $scope.isLoggedIn = false;
        $scope.login = {
            username: '',
            password: ''
        };

        $scope.room = '';

        $scope.chatLogin = function () {

            if ($scope.ChatLoginForm.$invalid) {
                return;
            }
            $scope.isLoggedIn = true;
            $scope.message.user = $scope.login.username;

            if ($scope.room !== '') {
                socketio.emit('room.join', $scope.room);
            } else {
                $scope.room = 'general';
            }

            APIService.getChatHistory($scope.room)
                .then(function(data) {
                    if(!data)
                        return;

                    $scope.history = data.messages;
                    console.log('scope history: ', $scope.history);
                })
                .catch(function(error) {
                    console.log('scope error: ', error);
                });
        };

        $scope.history = [];

        $scope.message = {
            user: '', //TODO replace with actual user
            content: '',
            timestamp: ''
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