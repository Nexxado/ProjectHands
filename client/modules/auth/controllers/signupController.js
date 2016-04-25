angular.module('ProjectHands.auth')

.controller('SignupController', function ($scope, AuthService) {

    $scope.signupSuccess = false;
    $scope.user = { //TODO clear placeholder data
        email: 'signup@gmail.com',
        password: '1234',
        _id: '222222222',
        name: "signup testing"
    };

    $scope.signup = function () {

        if ($scope.SignupForm.$invalid)
            return;

        AuthService.signup($scope.user).$promise
            .then(function (data) {
                console.log('data', data);
                $scope.signupSuccess = data.success;
            }).catch(function (error) {
                console.log('error', error);
                $scope.makeToast(error.data.errMessage, 'md-content', 'bottom right');
            });
    };
});
