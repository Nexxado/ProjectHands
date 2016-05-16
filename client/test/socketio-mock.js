angular.module('ProjectHands')

.factory("socketio", function ($rootScope) {
    var events = {};

    function connect() {
        return true;
    }

    function disconnect() {
        return true;
    }

    // Receive Events
    function on(eventName, callback) {
        if (!events[eventName]) events[eventName] = [];
        events[eventName].push(callback);
    }

    // Send Events
    function emit(eventName, data, emitCallback) {
        if (events[eventName]) {
            angular.forEach(events[eventName], function (callback) {
                $rootScope.$apply(function () {
                    callback(data);
                });
            });
        }
        if (emitCallback) emitCallback();
    }

    return {
        connect: connect,
        disconnect: disconnect,
        on: on,
        emit: emit
    };

});
