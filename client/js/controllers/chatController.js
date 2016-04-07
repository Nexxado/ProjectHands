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

            //Form validation
            if ($scope.ChatLoginForm.$invalid) {
                return;
            }
            $scope.isLoggedIn = true;
            $scope.message.user = $scope.login.username;

            //Join room
            if ($scope.room !== '') {
                socketio.emit('room.join', $scope.room);
            } else {
                $scope.room = 'General';
            }

            //Get chat history
            APIService.chat($scope.room).query({room: $scope.room}, function(chat) {
                if(chat.length > 0)
                    $scope.history = chat[0].messages;

                $scope.history.forEach(function (message) {
                    return parseTimestamp(message);
                });

                console.log($scope.history);

            } , function(error) {
                console.log('chat query error', error);
            });
        };

        $scope.sendMessage = function () {

            if ($scope.ChatMessageForm.$invalid) {
                return;
            }

            $scope.message.timestamp = new Date();
            $scope.history.push(parseTimestamp(angular.copy($scope.message)));

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


        //Change date object to HH:MM format
        function parseTimestamp(message) {
            var date = new Date(message.timestamp);
            var minutes = date.getMinutes();
            var hours = date.getHours();
            if(minutes < 10)
                minutes = '0' + minutes;
            if(hours < 10)
                hours = '0' + hours;

            message.timestamp = hours + ':' + minutes;

            return message;
        }

    });