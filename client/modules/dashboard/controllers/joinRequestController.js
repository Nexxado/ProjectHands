/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('JoinRequestController', function($scope, UserService, $mdDialog, $mdMedia) {

    $scope.signups = [];

    UserService.getAllSignups().$promise
        .then(function(result) {
            console.info('getAllSignups result', result);
            $scope.signups = result;
        })
        .catch(function(error) {
            console.info('getAllSignups error', error);
        });


    $scope.showUserDetails = function($event, user) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

        $mdDialog.show({
            controller: function ($scope, $mdDialog) {

                $scope.cancel = function() {
                    $mdDialog.cancel();
                }
            },
            templateUrl: '/modules/dashboard/templates/dialogs/userDetails.html',
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