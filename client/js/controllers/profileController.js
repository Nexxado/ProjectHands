angular.module('ProjectHands')

.controller('ProfileController', function($scope, AuthService, $mdDialog, $mdMedia, UtilsService) {


    /**
     * Invoke changePassword Dialog
     * @param $event {Object} 
     */
    $scope.changePassword = function($event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

        $mdDialog.show({
            controller: 'ChangePasswordDialogController',
            templateUrl: '/templates/dialogs/changePassword.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
            .then(function (result) {


            }, function () {
                //Dialog Canceled
            });
    }

});