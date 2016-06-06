/**
 * Created by ND88 on 06/06/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('EditTeamDialogController', function($scope, TeamService, UserService, $mdDialog, team, users) {


    $scope.cancel = function() {
        $mdDialog.cancel();
    }
});
