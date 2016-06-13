/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('EditUserDialogController', function($scope, $mdDialog, UtilsService, UserService, ROLES, user) {

    var toastAnchor = 'md-dialog';
    $scope.user = angular.copy(user);
    $scope.changeRoleEnabled = false;
    $scope.roles = [];

    for(var role in ROLES) {
        if(ROLES.hasOwnProperty(role))
            $scope.roles.push(ROLES[role])
    }


    $scope.enableRoleChange = function() {
        $scope.changeRoleEnabled = !$scope.changeRoleEnabled;

        if(!$scope.changeRoleEnabled)
            abortRoleChange();
    };


    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit = function () {

        if($scope.EditUserForm.$invalid)
            return;

        // if($scope.changeRoleEnabled) {
        //     UserService.updateRole($scope.user.email, $scope.user.role).$promise
        //         .then(function(result) {
        //             console.log('updateRole result', result);
        //         })
        //         .catch(function(error) {
        //             console.log('updateRole error', error);
        //         });
        // }

        if(angular.equals($scope.user, user))
            return $mdDialog.cancel();

        UserService.updateUser($scope.user).$promise
            .then(function(result) {
                console.log('updateUser result', result);
                $mdDialog.hide($scope.user);
            })
            .catch(function(error) {
                console.log('updateUser error', error);
                UtilsService.makeToast('Failed to update user', toastAnchor, 'bottom');
            });
    };


    /**
     * Reset role ngModel to user role
     */
    function abortRoleChange() {
        $scope.user.role = user.role;
    }
    
});