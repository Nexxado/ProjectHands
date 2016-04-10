angular.module('ProjectHands', ['ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ui.router', 'ct.ui.router.extras', 'ui.bootstrap', 'gridster'])

.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
});
