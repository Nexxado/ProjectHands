angular.module('ProjectHands')

.factory('socketio', function ($rootScope) {
    var socket = io.connect();

    return {
        on: function (eventName, callback) {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
