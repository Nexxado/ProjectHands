angular.module('ProjectHands.auth')

.service('SessionService', function ($rootScope, AuthService, AUTH_EVENTS, socketio) {

    this.clearSession = function () {

        socketio.disconnect();

        $rootScope.isLoggedIn = false;
        $rootScope.userName = null;
        $rootScope.userEmail = null;
    };

    this.getSession = function () {
        AuthService.isLoggedIn().$promise
            .then(function(result) {
                console.log('getSession result', result);

                socketio.connect();
                socketio.emit('logged-in', result);

                $rootScope.isLoggedIn = true;
                $rootScope.userName = result.name;
                $rootScope.userEmail = result.email;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {userName: result.name, role: result.role});
            })
            .catch(function(error) {
                console.log('isLoggedIn error', error);
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            });
    };
});
