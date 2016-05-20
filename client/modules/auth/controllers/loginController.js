angular.module('ProjectHands.auth')

.controller('LoginController', function ($scope, $rootScope, UtilsService, SessionService, AuthService, AUTH_EVENTS, $window) {

    var toastAnchor = '#loginToastsAnchor';

    /***** Form Model *****/
    $scope.email = '';
    $scope.password = '';
    $scope.rememberMe = false;

    $scope.login = function () {

        if ($scope.LoginForm.$invalid)
            return;

        AuthService.login($scope.email, $scope.password, $scope.rememberMe)
            .then(function (data) {
                console.log('auth data', data);
                SessionService.startSession(data);
                resetForm();

            })
            .catch(function (error) {
                console.log('login error ', error);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                UtilsService.makeToast('האימייל או הסיסמה אינם נכונים', toastAnchor, 'bottom right');
            });
    };

    /********************************/
    /***** OAuth2 Login Methods *****/
    /********************************/
    $scope.loginGoogle = function() {
        $window.open('/api/auth/google','',' scrollbars=yes,menubar=no,width=500, resizable=yes,toolbar=no,location=no,status=no');
    };

    $scope.loginFacebook = function() {
        $window.open('/api/auth/facebook','',' scrollbars=yes,menubar=no,width=500, resizable=yes,toolbar=no,location=no,status=no');
    };

    $window.loginCallBack = function() {
        console.log('loginCallBack');
        SessionService.getSession();
    };


    
    function resetForm() {
        $scope.email = '';
        $scope.password = '';
        $scope.LoginForm.$setPristine();
        $scope.LoginForm.$setUntouched();
        $scope.rememberMe = false;
    }
    
});
