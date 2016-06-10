/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('EditUserDialogController', function($scope, $mdDialog, user) {

    $scope.user = user;
    $scope.changeRoleEnabled = false;
    
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit = function () {
        $mdDialog.hide();
    }
    
});