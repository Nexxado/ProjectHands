/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('JoinRequestController', function ($scope, UserService, UtilsService, ROLES, $mdDialog, $mdMedia) {

        $scope.search = '';
        $scope.signups = [];
        $scope.selectedUser;
        $scope.selectedRole = ROLES.VOLUNTEER;
        $scope.roles = [];

        for(var role in ROLES) {
            if(ROLES.hasOwnProperty(role) && ROLES[role] !== ROLES.GUEST && ROLES[role] !== ROLES.TEAM_LEAD)
                $scope.roles.push(ROLES[role])
        }

        UserService.getAllSignups().$promise
            .then(function (result) {
                console.info('getAllSignups result', result);
                $scope.signups = result;
            })
            .catch(function (error) {
                console.info('getAllSignups error', error);
            });


        $scope.showUserDetails = function ($event, user) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');


            if (!isMobile) {
                if ($scope.selectedUser === user) {
                    $scope.selectedUser = undefined;
                    $scope.selectedRole = ROLES.VOLUNTEER;
                    return;
                }

                $scope.selectedUser = user;
            }
            else {
                $mdDialog.show({
                    controller: function ($scope, $mdDialog, ROLES, user, roles) {

                        $scope.user = user;
                        $scope.roles = roles;
                        $scope.selectedRole = ROLES.VOLUNTEER;

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        $scope.submit = function (approve) {
                            $mdDialog.hide({approve: approve, role: $scope.selectedRole});
                        }
                    },
                    templateUrl: '/modules/dashboard/templates/dialogs/signupDetails.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals: {
                        user: user,
                        roles: $scope.roles
                    }
                })
                    .then(function (result) {
                        console.log('dialog result', result.approve);
                        if(result.approve)
                            $scope.approveUser(user, result.role);
                        else
                            $scope.deleteUser(user);


                    }, function () {
                        //Dialog Canceled
                    });
            }
        };


        $scope.isSelected = function (user) {
            return $scope.selectedUser === user;
        };

        $scope.approveUser = function(user, role) {
            UserService.approveUser(user.email, role).$promise
                .then(function(result) {
                    console.info('approveUser result', result);
                    removeUserFromList($scope.signups.indexOf(user));
                })
                .catch(function(error) {
                    console.info('approveUser error', error);
                });
        };

        $scope.deleteUser = function(user) {
            UserService.deleteUser(user.email).$promise
                .then(function(result) {
                    console.info('deleteUser result', result);
                    removeUserFromList($scope.signups.indexOf(user));
                })
                .catch(function(error) {
                    console.info('deleteUser error', error);
                });
        };

        function removeUserFromList(index) {
            $scope.signups.splice(index, 1);
            $scope.selectedUser = undefined;
            $scope.selectedRole = ROLES.VOLUNTEER;
        }
    });