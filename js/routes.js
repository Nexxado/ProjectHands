angular.module('ProjectHands')

.config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
        
    });
    
        $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html'
        
    });
    
      $stateProvider.state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html'
        
     });
    
    
    
    
});