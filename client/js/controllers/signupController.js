angular.module('ProjectHands')

.controller('SignupController', function ($scope, AuthService, $mdToast) {

    $scope.user = {
        email: 'signup@gmail.com',
        password: '1234',
        _id: '222222222',
        name: "signup testing"
    };

    $scope.signup = function () {

        if ($scope.SignupForm.$invalid)
            return;
        //TODO do something on successful/failure
        AuthService.signup($scope.user).$promise
            .then(function (data) {
                console.log('data', data);
            }).catch(function (error) {
                console.log('error', error);
            });
    };
});
