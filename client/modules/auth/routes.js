angular.module('ProjectHands.auth')

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'modules/auth/templates/login.html',
        controller: 'LoginController'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'modules/auth/templates/signup.html',
        controller: 'SignupController'
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
