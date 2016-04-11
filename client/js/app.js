angular.module('ProjectHands', ['ngResource', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ui.router', 'ct.ui.router.extras', 'ui.bootstrap', 'gridster', 'ui.calendar'])


.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
})

.constant('COLLECTIONS', {
    
    RENOVATIONS: 'renovations',
    CHATS: 'chats',
    USERS: 'users',
    TEAMS: 'teams'
});
