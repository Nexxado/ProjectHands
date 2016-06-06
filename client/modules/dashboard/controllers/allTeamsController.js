/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('AllTeamsController', function ($scope, UserService, TeamService, UtilsService, ROLES, $mdDialog, $mdMedia) {

        $scope.users = [];
        $scope.teams = [];
        $scope.selectedTeam;
        $scope.selectedIndex = -1;
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
                    getAllTeamsInfo();
                })
                .catch(function (error) {
                    console.info('getAllTeams error', error);
                });
        }


        $scope.showTeamMembers = function (team, index) {
            $scope.selectedTeam = team;
            $scope.selectedIndex = index;
        };

        $scope.hideTeamMembers = function () {
            $scope.selectedTeam = undefined;
            $scope.selectedIndex = -1;
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


        /**
         * Invoke dialog to create a new team
         */
        $scope.createTeam = function($event) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog, TeamService, usersWithoutTeam, existingTeams) {

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
                },
                templateUrl: '/modules/dashboard/templates/dialogs/createTeam.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: isMobile,
                locals: {
                    usersWithoutTeam: getUsersWithoutTeam(),
                    existingTeams: $scope.teams.map(function(team) {
                        return team.name;
                    })
                }
            })
                .then(function (team) {
                    console.log('dialog result', team);
                    team.members_info = getUsersInfo(team.members);
                    team.manager_name = team.members_info[0].name;
                    $scope.teams.push(team);

                }, function () {
                    //Dialog Canceled
                });

        };


        /**
         * Invoke Delete Team dialog
         * @param $event
         * @param team {Object} : team to be deleted
         */
        $scope.deleteTeam = function ($event, team) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
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
                },
                templateUrl: '/modules/dashboard/templates/dialogs/deleteTeam.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: isMobile,
                locals: {
                    team: angular.copy(team)
                }
            })
                .then(function (team) {
                    console.log('dialog result', team);
                    TeamService.deleteTeam(team.name).$promise
                        .then(function(result) {
                            $scope.teams.splice($scope.selectedIndex, 1);
                            $scope.selectedTeam = undefined;
                            $scope.selectedIndex = -1;
                        })
                        .catch(function(error) {

                        })

                }, function () {
                    //Dialog Canceled
                });
        };


        /**
         * Invoke dialog showing the user details
         * @param $event
         * @param user {Object}
         */
        $scope.showUserDetails = function ($event, user) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            var temp = angular.copy(user);
            temp.role = UtilsService.translateRole(temp.role);

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
                    user: temp
                }
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
            addedUsers = addedUsers.filter(function (email) {
                return team.members.indexOf(email) < 0;
            });
            //Remove users not in team from removedUsers
            removedUsers = removedUsers.filter(function (email) {
                return team.members.indexOf(email) >= 0;
            });

            if (addedUsers.length)
                addMembers(team, manager_email, addedUsers, removedUsers);
            else if (removedUsers.length)
                removeMembers(team, manager_email, removedUsers);
            else
                updateManager(team, manager_email);
        }


        /**
         * Add members to team, on success remove members
         * @param team {Object} : the team to update
         * @param manager_email {String} : new manager's email
         * @param addedUsers {Array} : array of users' email to added to team
         * @param removedUsers {Array} : array of users' email to remove from team
         */
        function addMembers(team, manager_email, addedUsers, removedUsers) {
            if (!addedUsers.length)
                return;

            TeamService.addMembers(team.name, addedUsers).$promise
                .then(function (result) {
                    team.members = team.members.concat(addedUsers);
                    team.members_info = team.members_info.concat(getUsersInfo(addedUsers));
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

            if (!removedUsers.length)
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
         * @param manager_email {String} : new manager's email
         */
        function updateManager(team, manager_email) {

            if (!manager_email || manager_email === '' || manager_email === team.manager)
                return;

            var formerManager = team.manager;

            TeamService.assignManager(team.name, manager_email).$promise
                .then(function (result) {
                    team.manager = manager_email;
                    team.manager_name = getUsersInfo([manager_email])[0].name;

                    //Update user roles in View
                    for(var i = 0; i < $scope.users.length; i++) {
                        if($scope.users[i].email === formerManager)
                            $scope.users[i].role = ROLES.VOLUNTEER;
                        else if($scope.users[i].email === manager_email)
                            $scope.users[i].role = ROLES.TEAM_LEAD;
                    }
                    getAllTeamsInfo();
                })
                .catch(function (error) {
                    console.error('assign manager error', error);
                })
        }


        /**
         * Get members info for each team
         */
        function getAllTeamsInfo() {

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
         * Get members info for team
         * @param emails {Array} : array of user emails
         * @returns {Array} : array of user objects
         */
        function getUsersInfo(emails) {
            var users = [];
            emails.forEach(function (email) {

                users.push($.grep($scope.users, function (user, index) {
                    return user.email === email;
                })[0]);
            });

            return users;
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
