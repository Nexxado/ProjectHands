angular.module('ProjectHands')

.factory('socketio', function () {

    var socket;

    function connect() {
        socket = io.connect();
    }

    function disconnect() {
        if(!socket)
            return;

        socket.emit('client-disconnect');
        socket = undefined;
    }

    function emit(eventName, data) {
        if(!socket)
            return;

        socket.emit(eventName, data);
    }

    function on(eventName, callback) {
        if(!socket)
            return;

        socket.on(eventName, callback);
    }



    return {
        connect: connect,
        disconnect: disconnect,
        emit: emit,
        on: on
    };
});
