angular.module('ProjectHands.home')

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'modules/home/templates/home.html',
        controller: 'HomeController'
    });
 
});
