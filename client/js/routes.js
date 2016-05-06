angular.module('ProjectHands')

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/home');

    // .state('home', {
    //     url: '/home',
    //     templateUrl: 'templates/home.html',
    //     controller: 'HomeController'
    // })

    $stateProvider.state('renovation_dashboard', {
        url: '/renovation_dashboard',
        templateUrl: 'templates/renovation_dashboard.html',
        controller: 'renovationDashboardController'
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
