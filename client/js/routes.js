angular.module('ProjectHands')

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider.state('renovation_dashboard', {
            url: '/renovation_dashboard',
            templateUrl: 'templates/renovation_dashboard.html',
            controller: 'renovationDashboardController'
        })

            .state('result', {
                url: '/result/:type/:message',
                templateUrl: 'templates/result.html',
                controller: function ($scope, $stateParams, UtilsService) {

                    $scope.type = $stateParams.type;
                    $scope.message = UtilsService.toTitleCase(decodeURI($stateParams.message));
                },
                params: {
                    type: 'error',
                    message: 'Unknown Error'
                }
            })


            .state('status', {
                url: '/status',
                templateUrl: 'templates/status.html',
                controller: 'StatusController'
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
