angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, AuthService, AUTH_EVENTS, socketio) {

    var self = this;

    this.clearSession = function () {

        socketio.disconnect();

        $rootScope.isLoggedIn = false;
        $rootScope.user = undefined;
    };

    this.startSession = function(user) {
        console.log('startSession user', user);

        socketio.connect();
        socketio.emit('logged-in', user);
        
        $rootScope.isLoggedIn = true;
        $rootScope.user = user;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
    };

    this.getSession = function () {
        AuthService.isLoggedIn().$promise
            .then(function(result) {
                console.log('getSession result', result);
                self.startSession(result);
            })
            .catch(function(error) {
                console.log('isLoggedIn error', error);
                self.clearSession();
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            });
    };
});
