angular.module('ProjectHands')

.factory('socketio', function () {

    return io.connect();
});
