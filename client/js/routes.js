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

            .state('profile', {
                url: '/profile',
                template: '<md-content>' +
                                '<profile></profile>' +
                            '</md-content>'
            });

        $locationProvider.html5Mode(true);
    });
