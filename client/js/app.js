angular.module('ProjectHands', ['ngResource', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ui.router', 'ct.ui.router.extras', 'gridster', 'ui.calendar'])


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
})

//DEV Global Methods
.run(function ($rootScope, $mdToast) {

    $rootScope.constructionToast = function (position) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Under Construction')
            .position(position)
            .parent('#main-view')
            .capsule(true)
            .hideDelay(2000)
        );
    };
});
