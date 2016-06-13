/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('CreateTeamDialogController', function ($scope, $mdToast, $mdDialog, TeamService, usersWithoutTeam, existingTeams) {

    //Input Models
    $scope.usersWithoutTeam = usersWithoutTeam;
    $scope.teamName = '';
    $scope.teamManager = {
        name: '',
        email: ''
    };

    //Set Form elements to Invalid if team name already exists
    $scope.checkExists = function() {
        $scope.CreateTeamForm.teamName.$setValidity('exists', existingTeams.indexOf($scope.teamName) < 0);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit = function () {
        //Make form dirty to enable md-select validation
        $scope.CreateTeamForm.$setDirty();
        $scope.CreateTeamForm.teamManager.$setDirty();
        if($scope.CreateTeamForm.$invalid)
            return;

        TeamService.createTeam($scope.teamName, $scope.teamManager.email).$promise
            .then(function(result) {
                $mdDialog.hide(result);
            })
            .catch(function(error) {

            });
    };
});