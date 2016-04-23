angular.module('ProjectHands')

.controller('LoginController', function ($scope, $rootScope, $mdToast, AuthService, AUTH_EVENTS) {


    $scope.email = 'test@gmail.com';
    $scope.password = '1234';
    $scope.rememberMe = false;

    $scope.login = function () {

        if ($scope.LoginForm.$invalid)
            return;

        AuthService.login($scope.email, $scope.password, $scope.rememberMe)
            .then(function (data) {
                console.log('auth data', data);
//                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            })
            .catch(function (error) {
                console.log('login error ', error);
//                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('האימייל או הסיסמה אינם נכונים')
                    .position('top')
                    .parent('#loginToastsAnchor')
                    .capsule(true)
                    .hideDelay(2000)
                );
            });


    };


});
