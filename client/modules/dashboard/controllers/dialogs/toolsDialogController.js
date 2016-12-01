/**
 * Created by ND88 on 01/12/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('ToolsDialogController', function ($scope, RenovationService) {
    $scope.toolsInRenovation = [];
    $scope.tools = [];

    RenovationService.getTools().$promise
        .then(function(result) {
            $scope.tools = result;
        })
        .catch(function(error) {

        });




});