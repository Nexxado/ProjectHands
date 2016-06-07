angular.module('ProjectHands.statistics')

.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider.state('statistics', {
        url: '/statistics',
        templateUrl: 'modules/statistics/templates/statistics.html',
        controller: 'StatisticsController'
    });
 
});
