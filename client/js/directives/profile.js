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
                $scope.userHaveProfilePic = false;

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

                var album = '';
                $scope.profilePic = {};
                $scope.profilePicUrl = {};

                $scope.profile = {};

                AuthService.isLoggedIn()
                    .$promise
                    .then(function (result) {
                        $scope.isLoggedIn = true;
                        $scope.profile = result;
                        album = $scope.profile.email;
                        $scope.getProfilePic(album);
                        console.log(result);
                    })
                    .catch(function (error) {
                        $scope.isLoggedIn = false;
                    });

                $scope.getProfilePic = function (album) {
                    PhotosService.profileGet(album)
                        .then(function (data) {
                            $scope.profilePic = data[0];

                            if ($scope.profilePic === undefined)
                                $scope.userHaveProfilePic = false;
                            else {
                                $scope.userHaveProfilePic = true;
                                $scope.profilePicUrl = $scope.profilePic.web_link;
                            }

                        })
                        .catch(function (error) {

                        });
                };

                $scope.progress = false;
                $scope.progressDelete = false;
                $scope.$watch('files', function () {
                    $scope.upload($scope.files);
                });
                $scope.$watch('file', function () {
                    if ($scope.file != null) {
                        $scope.files = [$scope.file];
                    }
                });
                $scope.deletePhoto = function (fileId, index) {
                    $scope.progressDelete = true;
                    PhotosService.profileDelete(fileId)
                        .then(function (data) {
                            console.log('deletePhoto data', data);
                            //update album after delete
                            // $scope.getPhotos($scope.album);
                            $scope.images.splice(index, 1);
                        })
                        .catch(function (error) {
                            console.log('deletePhoto error ', error);
                        });
                }
                $scope.upload = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            if (!file.$error) {
                                $scope.progress = true;
                                PhotosService.profileUpload(album, file)
                                    .then(function (data) {
                                        console.log('uploadPhoto data', data);
                                        $scope.progress = false;
                                        // $scope.images.push(data);
                                        $scope.profilePicUrl = data.web_link;
                                        $scope.userHaveProfilePic = true;
                                    })
                                    .catch(function (error) {
                                        console.log('uploadPhoto error ', error);
                                        $scope.progress = false;
                                    });
                            }
                        }
                    }
                };

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
