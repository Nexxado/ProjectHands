angular.module('ProjectHands')

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })

    .state('renovation_dashboard', {
        url: '/renovation_dashboard',
        templateUrl: 'templates/renovation_dashboard.html',
        controller: 'renovationDashboardController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
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
    })

    .state('error', {
        url: '/error/:errMessage',
        templateUrl: 'templates/error.html',
        controller: function ($scope, $stateParams) {
            $scope.errMessage = $scope.toTitleCase(decodeURI($stateParams.errMessage));
        },
        params: {
            errMessage: 'Unknown Error'
        }
    })


    .state('about', {
        url: '/about',
        templateUrl: 'templates/about/index.html',
        controller: 'AboutController',
        deepStateRedirect: {
            default: {
                state: 'about.who'
            }
        }
    })

    .state('about.who', {
        url: '/who',
        templateUrl: 'templates/about/who.html'
    })

    .state('about.jobs', {
        url: '/jobs',
        templateUrl: 'templates/about/jobs.html'
    })

    .state('about.contact', {
        url: '/contact',
        templateUrl: 'templates/about/contact.html'
    });

    $locationProvider.html5Mode(true);
});
