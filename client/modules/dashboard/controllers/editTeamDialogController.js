/**
 * Created by ND88 on 06/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('EditTeamDialogController', function($scope, TeamService, UserService, $mdDialog, team, users) {

    $scope.users = users;
    $scope.team = team;
    $scope.teamManager = {
        name: team.manager_name,
        email: team.manager
    };


    $scope.submit = function() {

        $scope.EditTeamForm.$setDirty();
        $scope.EditTeamForm.teamManager.$setDirty();
        if($scope.EditTeamForm.$invalid)
            return;

        console.info('dialog approved')
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.removeUser = function(index, user) {
        $scope.team.members_info.splice(index, 1);
        $scope.team.members.splice($scope.team.members.indexOf(user.email), 1);
        $scope.users.push(user);

        if(user.email === $scope.teamManager.email) {
            $scope.EditTeamForm.$setDirty();
            $scope.EditTeamForm.teamManager.$setDirty();
            $scope.EditTeamForm.teamManager.$setValidity('required', false);
            $scope.teamManager.email = '';
            $scope.teamManager.name = '';
        }
    };

    $scope.addUser = function(index, user) {
        $scope.users.splice(index, 1);
        $scope.team.members.push(user.email);
        $scope.team.members_info.push(user);
    };
});
