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

    .constant('ROUTE_ERRORS', {
        alreadyLoggedIn: 'User Already Logged In',
        notLoggedIn: 'Not Logged In',
        notAllowed: 'Not Allowed',
        signupProcessCompleted: 'Sign Up Process Already Completed'
    })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS, ROUTE_ERRORS, SessionService, UtilsService, $q, ROLES, $timeout) {

        //Email Regex according to RFC 5322. - http://emailregex.com/
        $rootScope.regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        $rootScope.rootToastAnchor = '#main-view';
        SessionService.getSession(); //Restore session on page refresh

        var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) { return ROLES[key]; }).reverse();
        var defaultRedirectState = 'dashboard.main-page';
        var guestRedirectState = 'home';


        /*********************************/
        /***** Route Resolve Methods *****/
        /*********************************/

        /**
         * Authenticating user based on role
         * @param   {string} action : The action the user is trying to perform
         * @returns {Function} A resolved/rejected promise based on authentication
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
                        deferred.reject(ROUTE_ERRORS.notLoggedIn);
                    else if(error.status === 403)
                        deferred.reject(ROUTE_ERRORS.notAllowed);
                });

            return deferred.promise;
        };


        /**
         * Check if user is already logged in
         * @returns {Function} A resolved/rejected promise
         */
        $rootScope.alreadyLoggedIn = function() {
            var deferred = $q.defer();
            if(typeof $rootScope.isLoggedIn === 'undefined' || $rootScope.isLoggedIn === false)
                deferred.resolve();
            else
                deferred.reject(ROUTE_ERRORS.alreadyLoggedIn);
            // console.info('alreadyLoggedIn', deferred.promise);
            return deferred.promise;
        };

        /********************************************/
        /***** Application Wide Event Listeners *****/
        /********************************************/
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
            console.info('AUTH_EVENTS.loginSuccess');
            if(typeof user.signup_complete === 'boolean' && user.signup_complete === false) {
                return $state.go('signup_oauth');
                    // .then(function () {
                    //     UtilsService.makeToast('w00t w00t', $rootScope.rootToastAnchor, 'top right');
                    // });
            }

            var toState = ROLES_HIERARCHY.indexOf(user.role) > 0 ? defaultRedirectState : guestRedirectState;

            $timeout(function() {
                $rootScope.initNotifications();
                $rootScope.initChat();
            });

            if($state.is('login'))
                $state.go(toState)
                    .then(function () {
                        UtilsService.makeToast('ברוך הבא ' + user.name, $rootScope.rootToastAnchor, 'top right');
                    });
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event) {
            console.info('AUTH_EVENTS.logoutSuccess');
            SessionService.clearSession();
            $state.go('home')
                .then(function () {
                    UtilsService.makeToast('להתראות!', $rootScope.rootToastAnchor, 'top right');
                });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function (event, error) {
            console.info('AUTH_EVENTS.notAuthorized');
            $state.go('home')
                .then(function(){
                    UtilsService.makeToast(error, $rootScope.rootToastAnchor, 'top right');
                });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event, error) {
            console.info('AUTH_EVENTS.notAuthenticated');
            SessionService.clearSession();
            $state.go('login')
                .then(function() {
                    UtilsService.makeToast(error, $rootScope.rootToastAnchor, 'top right');
                });
        });

        $rootScope.$on('$stateChangeError', function(event) {
            console.info('stateChangeError', arguments);
            var error = arguments[5];
            if(error) {
                switch(error) {
                    case ROUTE_ERRORS.notAllowed:
                    case ROUTE_ERRORS.alreadyLoggedIn:
                    case ROUTE_ERRORS.signupProcessCompleted:
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, error);
                        break;
                    case ROUTE_ERRORS.notLoggedIn:
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, error);
                        break;
                }
            }
        })

    });