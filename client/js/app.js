angular.module('ProjectHands', ['ngResource', 'ngAria', 'ngAnimate', 'ngMessages', 'ngCookies', 'ngMaterial', 'ui.router', 'ct.ui.router.extras', 'gridster', 'ui.calendar', 'ProjectHands.dashboard'])


.config(function ($mdThemingProvider, $provide) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

    //Decoration for ExceptionHandler
    $provide.decorator('$exceptionHandler', function ($delegate) {
        return function (exception, cause) {

            exception.message = exception.message +
                '\nCaused by: ' + cause +
                '\nOrigin: ' + exception.fileName + ':' + exception.lineNumber + ':' + exception.columnNumber +
                '\n\nStacktrace:';

            $delegate(exception, cause);
        };
    });
})

.constant('COLLECTIONS', {
    RENOVATIONS: 'renovations',
    CHATS: 'chats',
    USERS: 'users',
    TEAMS: 'teams'
})

.constant('ROLES', {
    ADMIN: "admin",
    MANAGER: "manager",
    TEAM_LEAD: "teamLead",
    VOLUNTEER: "volunteer"
})

.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, SessionService, $mdToast) {

    //Email Regex according to RFC 5322. - http://emailregex.com/
    $rootScope.regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    $rootScope.rootToastAnchor = '#main-view';
    SessionService.getSession(); //Restore session on page refresh


    var openStates = ['login', 'signup', 'home'];

    //Listen on State change and prevent if user doesn't have authorization or isnt open state
    $rootScope.$on('$stateChangeStart', function (event, toState) {
//        console.log('toState', toState);
//        console.log('is open?', openStates.indexOf(toState.name));

        if (openStates.indexOf(toState.name) === -1) {

            AuthService.authenticate()
                .$promise
                .then(function (result) {
//                    console.log('authenticate result', result);
                })
                .catch(function (error) {
//                    console.log('authenticate error', error);
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    event.preventDefault();
                    $state.go('home');
                });
        }
    });

    /********************************************/
    /***** Application Wide Event Listeners *****/
    /********************************************/
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event) {
        SessionService.startSession();
        $state.go('dashboard');
        $rootScope.makeToast('ברוך הבא!', 'body', 'top');
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event) {
        SessionService.endSession();
        $state.go('home');
        $rootScope.makeToast('להתראות!', 'body', 'top');
    });

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        $rootScope.makeToast('אינך מורשה לעשות זאת', $rootScope.rootToastAnchor, 'top right');
    });

    /**************************************/
    /***** Application Wide Functions *****/
    /**************************************/
    $rootScope.logout = function () {
        AuthService.logout()
            .$promise
            .then(function (result) {
                console.log(result);
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

            })
            .catch(function (error) {
                console.log(error);
                SessionService.endSession();
                $rootScope.makeToast('יציאה נכשלה', $rootScope.rootToastAnchor, 'top right');
            });
    };

    $rootScope.constructionToast = function (position) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('האתר תחת בניה')
            .position(position)
            .parent($rootScope.rootToastAnchor)
            .capsule(true)
            .hideDelay(2000)
        );
    };

    $rootScope.makeToast = function (message, anchor, position) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(message)
            .position(position)
            .parent(anchor)
            .capsule(true)
            .hideDelay(2000)
        );
    };
});
