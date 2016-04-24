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
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            })
            .catch(function (error) {
                console.log('login error ', error);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
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

    $scope.logout = function () {
        AuthService.logout()
            .$promise
            .then(function (result) {
                console.log(result);
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            })
            .catch(function (error) {
                console.log(error);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('יציאה נכשלה')
                    .position('top')
                    .parent('#loginToastsAnchor')
                    .capsule(true)
                    .hideDelay(2000)
                );
            });
    };

    $scope.authenticate = function () {
        AuthService.authenticate()
            .$promise
            .then(function (result) {
                console.log('authenticate result', result);
            })
            .catch(function (error) {
                console.log('authenticate error', error);
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            });
    };


});
