angular.module('ProjectHands.auth')

.controller('SignupController', function ($scope, AuthService, UtilsService) {

    $scope.signupSuccess = false;
    $scope.user = {
        email: '',
        password: '',
        phone: '',
        name: ''
    };

    $scope.toastAnchor = 'form';

    $scope.signup = function () {

        if ($scope.SignupForm.$invalid)
            return;

        // if(!AuthService.isLegalID($scope.user.realID)) {
        //     UtilsService.makeToast('תעודת זהות אינה חוקית', $scope.toastAnchor, 'bottom right');
        //     return;
        // }

        AuthService.signup($scope.user).$promise
            .then(function (data) {
                console.log('data', data);
                $scope.signupSuccess = data.success;
            }).catch(function (error) {
                console.log('error', error);
                UtilsService.makeToast(error.data.errMessage, $scope.toastAnchor, 'bottom right');
            });
    };
});
