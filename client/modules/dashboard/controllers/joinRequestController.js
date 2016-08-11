/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('JoinRequestController', function ($scope, UserService, UtilsService, ROLES, $mdDialog, $mdMedia) {

        $scope.search = '';
        $scope.signups = [];
        $scope.rejectedUsers = [];
        $scope.selectedUser;
        $scope.selectedRole = ROLES.VOLUNTEER;
        $scope.roles = [];

        /**
         * Construct ROLEs array
         */
        for (var role in ROLES) {
            if (ROLES.hasOwnProperty(role) && ROLES[role] !== ROLES.GUEST && ROLES[role] !== ROLES.TEAM_LEAD)
                $scope.roles.push(ROLES[role])
        }

        /**
         * Get all user sign-ups
         */
        UserService.getAllSignups().$promise
            .then(function (result) {
                console.info('getAllSignups result', result);
                $scope.signups = result;
            })
            .catch(function (error) {
                console.info('getAllSignups error', error);
                UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
            });

        /**
         * Get all rejected users
         */
        UserService.getAllRejects().$promise
            .then(function (result) {
                console.info('getAllRejects result', result);
                $scope.rejectedUsers = result;
            })
            .catch(function (error) {
                console.info('getAllRejects error', error);
                UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
            });
        /**
         * Show user details in a dialog
         * @param $event
         * @param user {object}
         * @param shouldReject {boolean} : if true, user will be rejected instead of deleted
         */
        $scope.showUserDetails = function ($event, user, shouldReject) {
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

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
                    if (result.approve)
                        $scope.approveUser(user, result.role);
                    else if (shouldReject)
                        $scope.rejectUser(user);
                    else
                        $scope.deleteUser(user);


                }, function () {
                    //Dialog Canceled
                });
        };

        /**
         * Check if user is selected
         * Shows selectedUser's details
         * @param user
         * @returns {boolean}
         */
        $scope.isSelected = function (user) {
            return $scope.selectedUser === user;
        };

        /**
         * Approve user to join
         * @param user {object}
         * @param role {string} : role to assign the user
         */
        $scope.approveUser = function (user, role) {
            UserService.approveUser(user.email, role).$promise
                .then(function (result) {
                    console.info('approveUser result', result);
                    removeUserFromList(user);
                    UtilsService.makeToast(user.name + " אושר בהצלחה", $scope.rootToastAnchor, 'top right');
                })
                .catch(function (error) {
                    console.info('approveUser error', error);
                    UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
                });
        };

        /**
         * Delete user permanently
         * @param user {object}
         */
        $scope.deleteUser = function (user) {
            UserService.deleteUser(user.email).$promise
                .then(function (result) {
                    console.info('deleteUser result', result);
                    removeUserFromList(user);
                    UtilsService.makeToast(user.name + " הוסר", $scope.rootToastAnchor, 'top right');
                })
                .catch(function (error) {
                    console.info('deleteUser error', error);
                    UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
                });
        };

        /**
         * Mark user as rejected, move him to rejected list
         * @param user {object}
         */
        $scope.rejectUser = function (user) {
            UserService.rejectUser(user.email).$promise
                .then(function (result) {
                    console.info('rejectUser result', result);
                    $scope.rejectedUsers.push(user);
                    removeUserFromList(user)
                })
                .catch(function (error) {
                    console.info('rejectUser error', error);
                    UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
                });
        };


        $scope.addUserNote = function ($event, user) {

            $mdDialog.show({
                controller: function ($scope, $mdDialog, note) {

                    $scope.note = note;

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        $mdDialog.hide($scope.note);
                    }
                },
                templateUrl: '/modules/dashboard/templates/dialogs/userNote.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    note: user.admin_note || ''
                }
            })
                .then(function (note) {
                    if (note !== user.admin_note) {
                        UserService.updateUserNote(user.email, note).$promise
                            .then(function (result) {
                                console.info('updateUserNote result', result);
                                $scope.user.note = note;
                                UtilsService.makeToast('עודכנה הערת מתנדב', $scope.rootToastAnchor, 'top right');
                            })
                            .catch(function (error) {
                                console.info('updateUserNote error', error);
                                UtilsService.makeToast(error.data.errMessage, $scope.rootToastAnchor, 'top right');
                            })
                    }

                }, function () {
                    //Dialog Canceled
                });
        };

        /**
         * Remove user from sign-ups/rejected list
         * @param user
         */
        function removeUserFromList(user) {
            var index = $scope.signups.indexOf(user);
            if (index > -1) {
                $scope.signups.splice(index, 1);
            } else {
                index = $scope.rejectedUsers.indexOf(user);
                $scope.rejectedUsers.splice(index, 1);
            }

            $scope.selectedUser = undefined;
            $scope.selectedRole = ROLES.VOLUNTEER;
        }
    });