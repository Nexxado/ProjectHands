/**
 * Created by ND88 on 05/06/2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('JoinRequestController', function ($scope, UserService, UtilsService, $mdDialog, $mdMedia) {

        $scope.search = '';
        $scope.signups = [];
        $scope.selectedUser;

        UserService.getAllSignups().$promise
            .then(function (result) {
                console.info('getAllSignups result', result);
                result.forEach(function (user) {
                    if (user.signupDate) {
                        user.signupDate = UtilsService.dateToDDMMYYYY(new Date(user.signupDate));
                    }
                });
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
                    return;
                }

                $scope.selectedUser = user;
            }
            else {
                $mdDialog.show({
                    controller: function ($scope, $mdDialog, user) {

                        $scope.user = user;
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        $scope.submit = function (approve) {
                            $mdDialog.hide(approve);
                        }
                    },
                    templateUrl: '/modules/dashboard/templates/dialogs/signupDetails.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals: {
                        user: user
                    }
                })
                    .then(function (approve) {
                        console.log('dialog result', approve);
                        if(approve)
                            $scope.approveUser(user);
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

        $scope.approveUser = function(user) {
            UserService.approveUser(user.email, 'volunteer').$promise
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
        }
    });