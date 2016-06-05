/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('JoinRequestController', function($scope, UserService) {

    $scope.signups = [];

    UserService.getAllSignups().$promise
        .then(function(result) {
            console.info('getAllSignups result', result);
            $scope.signups = result;
        })
        .catch(function(error) {
            console.info('getAllSignups error', error);
        })
});