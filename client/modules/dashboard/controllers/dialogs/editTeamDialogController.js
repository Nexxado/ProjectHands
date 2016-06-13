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

    //Arrays to hold member changes
    var usersAdded = [];
    var usersRemoved = [];

    /**
     * Submit dialog
     * pass arrays back to invoking controller
     */
    $scope.submit = function() {
        //Make form dirty to enable md-select validation
        $scope.EditTeamForm.$setDirty();
        $scope.EditTeamForm.teamManager.$setDirty();
        if($scope.EditTeamForm.$invalid)
            return;

        console.info('dialog approved');
        $mdDialog.hide({manager: $scope.teamManager.email, added: usersAdded, removed: usersRemoved});
    };

    /**
     * Cancel dialog, abort any changes made.
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    /**
     * Remove user from team members
     * @param index {Number} : index of user in members array
     * @param user {Object} : the user to be removed
     */
    $scope.removeUserFromTeam = function(index, user) {
        $scope.team.members_info.splice(index, 1);
        $scope.team.members.splice($scope.team.members.indexOf(user.email), 1);
        $scope.users.push(user);

        //Update arrays holding member changes
        usersRemoved.push(user.email);
        if(usersAdded.indexOf(user.email) >= 0)
            usersAdded.splice(usersAdded.indexOf(user.email), 1);

        if(user.email === $scope.teamManager.email) {
            //Set form to dirty to make sure to comes up as invalid if user submits
            $scope.EditTeamForm.$setDirty();
            $scope.EditTeamForm.teamManager.$setDirty();
            $scope.EditTeamForm.teamManager.$setValidity('required', false);
            $scope.teamManager.email = '';
            $scope.teamManager.name = '';
        }
    };

    /**
     * Add user to team
     * @param index {Number} : index of user in array of users without teams
     * @param user {Object} : the user to be added
     */
    $scope.addUserToTeam = function(index, user) {
        $scope.users.splice(index, 1);
        $scope.team.members.push(user.email);
        $scope.team.members_info.push(user);

        //Update arrays holding member changes
        usersAdded.push(user.email);
        if(usersRemoved.indexOf(user.email) >= 0)
            usersRemoved.splice(usersRemoved.indexOf(user.email), 1);
    };
});
