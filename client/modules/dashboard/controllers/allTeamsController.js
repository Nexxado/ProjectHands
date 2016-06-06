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
                    updateTeam(team, result.manager, result.added, result.removed);

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
                .then(function (result) {

                }, function () {
                    //Dialog Canceled
                });
        };


        /**
         * Update team in database and on client
         * @param team {Object} : the team to update
         * @param manager_email {String} : manager's email
         * @param addedUsers {Array} : array of users' email to added to team
         * @param removedUsers {Array} : array of users' email to remove from team
         */
        function updateTeam(team, manager_email, addedUsers, removedUsers) {

            //Remove users already in team from addedUsers
            addedUsers = addedUsers.filter(function (user) {
                return team.members.indexOf(user.email) < 0;
            });
            //Remove users not in team from removedUsers
            removedUsers = removedUsers.filter(function (user) {
                return team.members.indexOf(user.email) >= 0;
            });

            //Find manager's user object
            // if (manager_email !== team.manager) {
            //     var manager;
            //     if (team.members.indexOf(manager_email) >= 0)
            //         manager = team.members[team.members.indexOf(manager_email)];
            //     else if (addedUsers.indexOf(manager_email) >= 0)
            //         manager = addedUsers[addedUsers.indexOf(manager_email)];
            //     else {
            //         console.error('updateTeam', 'Couldn\'t find manager in team members or added users');
            //         return;
            //     }
            // }

            if (!addedUsers.length)
                addMembers(team, manager_email, addedUsers, removedUsers);
            else if (!removedUsers.length)
                removeMembers(team, manager_email, removedUsers);
            else
                updateManager(team, manager_email);


            // TeamService.updateTeam(team.name, manager.email, addedUsers, removedUsers).$promise
            //     .then(function(result) {
            //         team.manager = manager.email;
            //         team.manager_name = manager.name;
            //         team.members.push(addedUsers);
            //         removedUsers.forEach(function(user) {
            //             var index = team.members.indexOf(user);
            //             team.members.splice(index, 1);
            //             team.members_info.splice(index, 1);
            //         });
            //     })
            //     .catch(function(error) {
            //         console.error('updateTeam error', error);
            //     })
        }


        /**
         * Add members to team, on success remove members
         * @param team {Object} : the team to update
         * @param manager_email {String} : new manager's email
         * @param addedUsers {Array} : array of users' email to added to team
         * @param removedUsers {Array} : array of users' email to remove from team
         */
        function addMembers(team, manager_email, addedUsers, removedUsers) {
            if(!addedUsers.length)
                return;

            TeamService.addMembers(team.name, addedUsers).$promise
                .then(function (result) {
                    team.members.push(addedUsers);
                    removeMembers(team, manager_email, removedUsers);
                })
                .catch(function (error) {
                    console.error('addMembers error', error);
                })
        }

        /**
         * Remove members from team, on success assign manager
         * @param team {Object} : the team to update
         * @param manager_email {String} : new manager's email
         * @param removedUsers {Array} : array of users' email to remove from team
         */
        function removeMembers(team, manager_email, removedUsers) {

            if(!removedUsers.length)
                return;

            TeamService.removeMembers(team.name, removedUsers).$promise
                .then(function (result) {
                    removedUsers.forEach(function (user) {
                        var index = team.members.indexOf(user);
                        team.members.splice(index, 1);
                        team.members_info.splice(index, 1);
                    });

                    updateManager(team, manager_email)
                })
                .catch(function (error) {
                    console.error('removeMembers error', error);
                })
        }

        /**
         * Assign manager to team
         * @param team {Object} : the team to update
         * @param manager_email {Object} : new manager's email
         */
        function updateManager(team, manager_email) {

            if(!manager_email || manager_email === '' || manager_email === team.manager)
                return;

            TeamService.assignManager(team.name, manager.email).$promise
                .then(function (result) {
                    team.manager = manager_email;
                    // team.manager_name = manager.name;
                    //TODO update team object with manager_name
                })
                .catch(function (error) {
                    console.error('assign manager error', error);
                })
        }


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
