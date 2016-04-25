angular.module('ProjectHands.auth')

.controller('LoginController', function ($scope, $rootScope, AuthService, AUTH_EVENTS) {

    var toastAnchor = '#loginToastsAnchor';

    //TODO clear placeholder data
    $scope.email = 'test@gmail.com';
    $scope.password = '1234';
    $scope.rememberMe = false;

    $scope.login = function () {

        if ($scope.LoginForm.$invalid)
            return;

        AuthService.login($scope.email, $scope.password, $scope.rememberMe)
            .then(function (data) {
                console.log('auth data', data);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {userName: data.name, role: data.role});
                $scope.email = '';
                $scope.password = '';
                $scope.LoginForm.$setPristine();
                $scope.LoginForm.$setUntouched();
            })
            .catch(function (error) {
                console.log('login error ', error);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $rootScope.makeToast('האימייל או הסיסמה אינם נכונים', toastAnchor, 'bottom right');
            });


    };
});
