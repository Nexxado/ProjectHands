angular.module('ProjectHands')

.controller('SignupController', function ($scope, Auth, $mdToast) {

    $scope.user = {
        email: '1234@gmail.com',
        password: '1234',
        _id: '222222222',
        name: "signup testing"
    };

    $scope.signup = function () {

        if ($scope.SignupForm.$invalid)
            return;

        Auth.signup($scope.user).$promise
            .then(function (data) {
                console.log('data', data);
            }).catch(function (error) {
                console.log('error', error);
            });
    };
});
