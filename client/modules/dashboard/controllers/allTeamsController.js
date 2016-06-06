/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('AllTeamsController', function ($scope, UserService, TeamService, $mdDialog, $mdMedia) {

        $scope.users = [];
        $scope.teams = [];
        $scope.selectedTeam;
        $scope.searchTeams = '';
        $scope.searchUsers = '';
        $scope.searchTeamMembers = '';


        UserService.getAllUsers().$promise
            .then(function (result) {
                console.info('getAllUsers result', result);
                $scope.users = result;
                getAllTeams();
            })
            .catch(function (error) {
                console.info('getAllUsers error', error);
            });


        function getAllTeams() {
            TeamService.getAllTeams().$promise
                .then(function (result) {
                    console.info('getAllTeams result', result);
                    $scope.teams = result;
                    getMemberInfo();
                })
                .catch(function (error) {
                    console.info('getAllTeams error', error);
                });
        }


        $scope.showTeamMembers = function (team) {
            $scope.selectedTeam = team;
        };

        $scope.hideTeamMembers = function () {
            $scope.selectedTeam = undefined;
        };

        /**
         * Invoke edit team dialog
         * @param $event {Object}
         * @param team {Object} : team to be edited.
         */
        $scope.editTeam = function ($event, team) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            $mdDialog.show({
                controller: 'EditTeamDialogController',
                templateUrl: '/modules/dashboard/templates/dialogs/editTeam.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: isMobile,
                locals: {
                    team: angular.copy(team),
                    users: getUsersWithoutTeam()
                }
            })
                .then(function (result) {
                    console.log('dialog result', result);
                    //TODO Update team according to result.

                }, function () {
                    //Dialog Canceled
                });
        };


        $scope.showUserDetails = function ($event, user) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            $mdDialog.show({
                controller: function ($scope, $mdDialog, user) {

                    $scope.user = user;
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/modules/dashboard/templates/dialogs/userDetails.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: isMobile,
                locals: {
                    user: user
                }
            })
                .then(function (approve) {

                }, function () {
                    //Dialog Canceled
                });
        };


        /**
         * Get members info for each team
         */
        function getMemberInfo() {

            $scope.teams.forEach(function (team) {
                team.members_info = [];
                for (var i = 0; i < team.members.length; i++) {

                    var user = $.grep($scope.users, function (user, index) {
                        return user.email === team.members[i];
                    })[0];

                    team.members_info.push(user);

                    if (user && user.email === team.manager)
                        team.manager_name = user.name;
                }
            });
            console.info('team with member names', $scope.teams);
        }

        /**
         * Get array of users without team.
         * @returns {Array} : users who don't belong to any team
         */
        function getUsersWithoutTeam() {

            var usersInTeams = [];
            $scope.teams.forEach(function (team) {
                for (var i = 0; i < team.members.length; i++)
                    usersInTeams.push(team.members[i]);
            });

            var usersWithoutTeam = [];
            for (var i = 0; i < $scope.users.length; i++) {
                if (usersInTeams.indexOf($scope.users[i].email) < 0)
                    usersWithoutTeam.push($scope.users[i]);
            }

            return usersWithoutTeam;
        }
    });
