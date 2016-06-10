/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('DeleteTeamDialogController', function ($scope, $mdToast, $mdDialog, team) {
    $scope.team_name = team.name;
    $scope.typed_name = "";
    $scope.checkedUsers = [];

    //Set Form elements to Invalid if typed name != team name
    $scope.checkTeamName = function() {
        $scope.DeleteTeamForm.teamName.$setValidity('match', $scope.typed_name === $scope.team_name);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit = function () {
        if ($scope.DeleteTeamForm.$invalid || $scope.typed_name !== $scope.team_name)
            return;

        $mdDialog.hide(team);
    };
});