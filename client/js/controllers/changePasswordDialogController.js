/**
 * Created by ND88 on 06/06/2016.
 */
angular.module('ProjectHands')

    .controller('ChangePasswordDialogController', function ($scope, $rootScope, $mdDialog, AuthService) {

        //Input Models
        $scope.passwords = {
            oldPass: '',
            newPass1: '',
            newPass2: ''
        };

        //Set Form elements to Invalid if the 2 new passwords input don't match.
        $scope.newPassMatch = function () {
            $scope.ChangePasswordForm.newPass1.$setValidity('match', $scope.passwords.newPass1 === $scope.passwords.newPass2);
            $scope.ChangePasswordForm.newPass2.$setValidity('match', $scope.passwords.newPass1 === $scope.passwords.newPass2);
        };

        //Set Form elements to Invalid if any of the 2 new passwords input match old password
        $scope.oldPassMatch = function () {
            $scope.ChangePasswordForm.newPass1.$setValidity('oldMatch', $scope.passwords.newPass1 !== $scope.passwords.oldPass);
            $scope.ChangePasswordForm.newPass2.$setValidity('oldMatch', $scope.passwords.newPass2 !== $scope.passwords.oldPass);
        };


        $scope.submit = function () {

            if ($scope.ChangePasswordForm.$invalid)
                return;

            console.info('changing password', $rootScope.user, $scope.passwords);
            AuthService.changePassword($rootScope.user.email, $scope.passwords.oldPass, $scope.passwords.newPass1).$promise
                .then(function (result) {
                    console.info('changePassword result', result);
                    UtilsService.makeToast("שינוי סיסמה בוצע בהצלחה", $scope.rootToastAnchor, 'top right');
                    $mdDialog.hide(true);
                })
                .catch(function (error) {
                    console.info('changePassword error', error);
                    UtilsService.makeToast("עדכון הסיסמה נכשל!", $scope.rootToastAnchor, 'top right');
                    $mdDialog.hide(false);
                });
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        }
    });
