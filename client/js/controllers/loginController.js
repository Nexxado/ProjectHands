angular.module('ProjectHands')

.controller('LoginController', function ($scope, Auth) {

    $scope.username = 'test';
    $scope.password = '1234';
    $scope.status = '';

    $scope.foo = function () {

        
        Auth.login($scope.username, $scope.password).$promise
            .then(function (data) {
                console.log('auth data', data);
                $scope.status = data.data;

            })
            .catch(function (error) {
                window.alert('login error ', error);
            });


    };


});
