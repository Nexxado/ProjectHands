angular.module('ProjectHands.auth', [])

/**************************************/
/***** Application Wide Constants *****/
/**************************************/
    .constant('ROLES', {
        ADMIN: "admin",
        MANAGER: "manager",
        TEAM_LEAD: "teamLead",
        VOLUNTEER: "volunteer",
        GUEST: "guest"
    })

    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS, SessionService, UtilsService, $q, ROLES, $timeout) {

        //Email Regex according to RFC 5322. - http://emailregex.com/
        $rootScope.regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        $rootScope.rootToastAnchor = '#main-view';
        SessionService.getSession(); //Restore session on page refresh

        var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) { return ROLES[key]; }).reverse();
        var defaultRedirectState = 'dashboard.main-page';
        var guestRedirectState = 'home';


        /**
         * Authenticating user based on role
         * @param   {string} action : The action the user is trying to perform
         * @returns {object} A resolved/rejected promise based on authentication
         */
        $rootScope.authenticate = function (action) {
            console.log('Authenticating action', action);
            var deferred = $q.defer();

            AuthService.authenticate(action)
                .$promise
                .then(function (result) {
                    console.log('authenticate result', result);
                    deferred.resolve(result);

                })
                .catch(function (error) {
                    console.log('authenticate error', error);
                    if(error.status === 401)
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    else if(error.status === 403)
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

                    deferred.reject("Not Allowed");
                });

            return deferred.promise;
        };

        /********************************************/
        /***** Application Wide Event Listeners *****/
        /********************************************/
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
            var toState = ROLES_HIERARCHY.indexOf(user.role) > 0 ? defaultRedirectState : guestRedirectState;

            $timeout(function() {
                $rootScope.initNotifications();
            });

            $state.go(toState)
                .then(function () {
                    UtilsService.makeToast('ברוך הבא ' + user.name, $rootScope.rootToastAnchor, 'top right');
                });
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event) {
            SessionService.clearSession();
            $state.go('home')
                .then(function () {
                    UtilsService.makeToast('להתראות!', $rootScope.rootToastAnchor, 'top right');
                });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function (event) {
//        $state.go('login');
            UtilsService.makeToast('אין מספיק הרשאות', $rootScope.rootToastAnchor, 'top right');
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            SessionService.clearSession();
            $state.go('login')
                .then(function() {
                    UtilsService.makeToast('Please login', $rootScope.rootToastAnchor, 'top right');
                });
        });

    });