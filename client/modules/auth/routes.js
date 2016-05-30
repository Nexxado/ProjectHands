angular.module('ProjectHands.auth')

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'modules/auth/templates/login.html',
        controller: 'LoginController',
        resolve: {
            logged_in: function($rootScope) {
                return $rootScope.alreadyLoggedIn();
            }
        }
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'modules/auth/templates/signup.html',
        controller: 'SignupController',
        resolve: {
            logged_in: function($rootScope) {
                return $rootScope.alreadyLoggedIn();
            }
        }
    })

    .state('signup_oauth', {
        url: '/signup/oauth',
        controller: 'OAuthSignupController',
        templateUrl: 'modules/auth/templates/oauthSignup.html',
        resolve: {
            signup_complete: function($rootScope, $q, ROUTE_ERRORS) {
                var deferred = $q.defer();
                if(typeof $rootScope.user.signup_complete === 'boolean' && $rootScope.user.signup_complete === false)
                    deferred.resolve();
                else
                    deferred.reject(ROUTE_ERRORS.signupProcessCompleted);

                // console.info('signup_complete', deferred.promise);
                return deferred.promise;
            }
        }
    })

    .state('signup.activated', {
        url: '/activated',
        views: {
            '@': {
                template: '<div layout="column" layout-align="center center" layout-padding dir="rtl">' +
                    '<h1>חשבונך הופעל בהצלחה!</h1>' +
                    '<md-button class="md-primary md-raised" ui-sref="login" style="width: 20%;">היכנס לחשבון שלך</md-button>' +
                    '</div>'
            }
        }
    });
});
