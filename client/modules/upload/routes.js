angular.module('ProjectHands.upload')

.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'modules/home/templates/home.html',
        controller: 'HomeController'
    }).state('home-panel', {
        url: '/home-panel',
        templateUrl: 'modules/home/templates/home-panel.html',
        controller: 'HomePanelController'
    });
 
});
