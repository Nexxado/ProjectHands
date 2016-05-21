angular.module('ProjectHands', ['ngResource', 'ngAria', 'ngAnimate', 'ngMessages', 'ngCookies', 'ngMaterial',
    'ui.router', 'ct.ui.router.extras', 'gridster', 'ui.calendar',
    'ProjectHands.dashboard', 'ProjectHands.auth', 'ProjectHands.home'])


.config(function ($mdThemingProvider, $provide) {
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

.run(function ($rootScope, $mdToast, socketio) {


    /********************************************/
    /***** Application Wide Event Listeners *****/
    /********************************************/
    $rootScope.initChat = function() {
        console.info('INIT CHAT');
        socketio.on('online-users', function (data) {
            console.log('online-users', data.room, data.users);
            //TODO update online users per room
        });

        //TODO Init chat here!!!
    };


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
