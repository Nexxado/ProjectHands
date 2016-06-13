angular.module('ProjectHands', ['ngResource', 'ngAria', 'ngAnimate', 'ngMessages', 'ngCookies', 'ngMaterial',
    'ui.router', 'ct.ui.router.extras', 'gridster', 'ui.calendar', 'ProjectHands.dashboard', 'ProjectHands.auth',
    'ProjectHands.home', 'ProjectHands.photos', 'ngFileUpload', 'angulartics', 'angulartics.google.analytics',
    'pascalprecht.translate'])


.config(function ($mdThemingProvider, $provide, $translateProvider, LanguagesProvider) {
    //Set Angular-Material Theme
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

    //Decoration for ExceptionHandler
    $provide.decorator('$exceptionHandler', function ($delegate) {
        return function (exception, cause) {

            exception.message = exception.message +
                '\nCaused by: ' + cause +
                '\nOrigin: ' + exception.fileName + ':' + exception.lineNumber + ':' + exception.columnNumber +
                '\n\nStacktrace:';

            $delegate(exception, cause);
        };
    });

    $translateProvider.translations('he', LanguagesProvider.HE);
    $translateProvider.translations('ar', LanguagesProvider.AR);
    $translateProvider.preferredLanguage('he');
})

/**************************************/
/***** Application Wide Constants *****/
/**************************************/
.constant('COLLECTIONS', {
    RENOVATIONS: 'renovations',
    CHATS: 'chats',
    USERS: 'users',
    TEAMS: 'teams'
})

.run(function ($rootScope, $location, $mdToast) {
    
    var analytics = /localhost/.test($location.absUrl()) ? 'none' : 'auto';
    if(analytics === 'auto')
        console.info('Activating Analytics');

    ga('create', 'UA-79134913-1', analytics);

    $rootScope.rootToastAnchor = '#main-view';


    /*************************/
    /***** DEBUG METHODS *****/
    /*************************/
    //TODO DELETE

    $rootScope.constructionToast = function (position) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('האתר תחת בניה')
            .position(position)
            .parent($rootScope.rootToastAnchor)
            .capsule(true)
            .hideDelay(2000)
        );
    };

});
