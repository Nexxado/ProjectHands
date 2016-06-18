angular.module('ProjectHands')

.controller('ChatRoomController', function ($scope, $timeout, socketio, ChatService, UtilsService, $rootScope) {

    $scope.user = $rootScope.user;
    //Message Classes
    var class_message_self = 'chat-message-self';
    var class_message_others = 'chat-message-others';


//    $scope.room = $attrs.room;
//    $scope.user = $attrs.user;
//    console.log('chat-room user', $scope.user);
   console.log('chat-room', $scope.room);

    $scope.history = [];
    $scope.users = [];
    $scope.showUsersList = false;
    $scope.message = {
        user: $scope.user.name,
        content: '',
        timestamp: '',
        class: class_message_self,
        align: 'end'
    };

    socketio.on('message', function (message) {
        $scope.$apply(function () {
            message.dir = isHebrew(message.user) ? 'rtl' : 'ltr';
            message.class = class_message_others;
            $scope.history.push(parseTimestamp(message));
        });
    });

    socketio.on('online-users', function (users) {
        console.log('online-users', $scope.room, users);
        $scope.users = users;
    });

    socketio.emit('room.join', $scope.room);
    getChatHistory();


    $scope.sendMessage = function () {

        if ($scope.ChatMessageForm.$invalid)
            return;

        $scope.message.timestamp = new Date();
        $scope.history.push(parseTimestamp(angular.copy($scope.message)));

        //Don't save dir and class to DB.
        var message = angular.copy($scope.message);
        delete message.dir;
        delete message.class;

        socketio.emit('message', {message: message, room: $scope.room}, function (data) {
            console.log('Ack: ', data);
        });

        //reset form
        $scope.ChatMessageForm.$setPristine();
        $scope.ChatMessageForm.$setUntouched();
        $scope.message.content = '';
    };




    //Change date object to HH:MM format
    function parseTimestamp(message) {
        message.timestamp = UtilsService.parseTimestamp(message.timestamp);
        return message;
    }


    //Get chat history
    function getChatHistory() {

        ChatService.getChatHistory($scope.room).$promise
            .then(function (result) {
                console.log('result', result);
                if (result.messages && result.messages.length > 0) {
                    $scope.history = result.messages;

                    $scope.history.forEach(function (message) {
                        message.class = $scope.user.name === message.user ? class_message_self : class_message_others;
                        message.align = $scope.user.name === message.user ? "end" : "start";

                        return parseTimestamp(message);
                    });
                }

            })
            .catch(function (error) {
                console.log('chat query error', error);
                UtilsService.makeToast(error.data.errMessage, '.chat-room', 'top right');
            });
    }

    //Show user names for other users' messages
    $scope.showUsername = function(message, index)  {
        if(message.user === $scope.user.name)
            return false;

        if(index === 0)
            return true;

        return (message.user !== $scope.history[index-1].user);
    };

    //Regex for hebrew unicode chars
    function isHebrew(message) {
        return message.match(/[\u0590-\u05FF]+/);
    }

    //Scroll to bottom on new chat message
    $scope.$watchCollection('history', function(newVal, oldVal, scope) {
//        console.log("History Changed");
        scrollToBottom(".chat-message-list");
    });


    function scrollToBottom(elementSelector) {
        $timeout(function () {
            var element = angular.element(elementSelector);
            element.scrollTop(element[0].scrollHeight);
        });
    }

});
