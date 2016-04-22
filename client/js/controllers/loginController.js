angular.module('ProjectHands')

.controller('LoginController', function ($scope, Auth, $mdToast) {

    $scope.regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    $scope.email = 'test@gmail.com';
    $scope.password = '1234';
    $scope.status = '';

    $scope.login = function () {

        if ($scope.LoginForm.$invalid)
            return;

        Auth.login($scope.email, $scope.password).$promise
            .then(function (data) {
                console.log('auth data', data);
                $scope.status = data.access;

            })
            .catch(function (error) {
                console.log('login error ', error);
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
