angular.module('ProjectHands')

    .directive('profile', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/profile.html',
            controller: function ($scope, $location, PhotosService, $rootScope, UtilsService, SessionService, AuthService, AUTH_EVENTS,
                                  $window, $mdDialog, $mdMedia) {

                /**
                 * Invoke changePassword Dialog
                 * @param $event {Object}
                 */
                $scope.changePassword = function ($event) {
                    var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

                    $mdDialog.show({
                        controller: 'ChangePasswordDialogController',
                        templateUrl: '/templates/dialogs/changePassword.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen
                    })
                        .then(function (result) {


                        }, function () {
                            //Dialog Canceled
                        });
                };
                $scope.changeEmail = function () {

                    if ($scope.ChangeEmailForm.$invalid)
                        return;

                    AuthService.changeEmailRequest($scope.profile.email, $scope.email)
                        .$promise
                        .then(function (result) {
                            console.log(result);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                };
                $scope.isLoggedIn = false;
                $scope.reset_password = {
                    new: ""
                };
                var resetForm = function () {
                    $scope.change_password = {
                        old: "",
                        new: "",
                        conf_new: ""
                    };
                    $scope.reset_password = {
                        new: ""
                    };
                };
                $scope.profile = {};
                
                AuthService.isLoggedIn()
                    .$promise
                    .then(function (result) {
                        $scope.isLoggedIn = true;
                        $scope.profile = result;
                        // album = $scope.profile.email;
                        // $scope.getProfilePic(album);
                        // console.log(result);
                    })
                    .catch(function (error) {
                        $scope.isLoggedIn = false;
                    });

                $scope.sProfiel = true;
                $scope.sAccount = false;
                $scope.sEmails = false;
                $scope.showProfile = function () {
                    $scope.sProfiel = true;
                    $scope.sAccount = false;
                    $scope.sEmails = false;
                };
                $scope.showAccount = function () {
                    $scope.sProfiel = false;
                    $scope.sAccount = true;
                    $scope.sEmails = false;
                };
                $scope.showEmails = function () {
                    $scope.sProfiel = false;
                    $scope.sAccount = false;
                    $scope.sEmails = true;
                };
            }
        };
    });
