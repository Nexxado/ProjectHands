/**
 * Created by ND88 on 25/05/2016.
 */
angular.module('ProjectHands')

.controller('StatusController', function($scope, StatusService) {

    $scope.newStatus = {
        message: '',
        status: false
    };

    StatusService.getStatus().$promise
        .then(function (result) {
            $scope.active = result.active;
            $scope.message = result.message;
        })
        .catch(function (error) {

        });

    $scope.updateStatus = function () {

        StatusService.updateStatus($scope.newStatus.status, $scope.newStatus.message).$promise
            .then(function (result) {
                $scope.active = result.active;
                $scope.message = result.message;
            })
            .catch(function (error) {

            });

        $scope.newStatus = {
            message: '',
            status: false
        };
    }
});
