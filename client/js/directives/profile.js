angular.module('ProjectHands')

    .directive('profile', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/profile.html',
            controller: function ($scope, $location, AuthService, PhotosService) {

                $scope.isLoggedIn = false;

                $scope.change_password = {
                    old: "",
                    new: "",
                    conf_new: ""
                };
                $scope.reset_password = {
                    new: ""
                };

                $scope.changePassword = function () {
                    if ($scope.chPassForm.$invalid)
                        return;

                    if (!($scope.change_password.old === $scope.change_password.conf_new))
                        return;

                    AuthService.changePassword($scope.profile.email, $scope.change_password.old, $scope.change_password.new)
                        .then(function (data) {

                        })
                        .catch(function (error) {

                        });
                    
                    resetForm();
                };
                $scope.resetPassword = function () {
                    if ($scope.resetPasswordForm.$invalid)
                        return;

                    AuthService.resetPassword($scope.profile.email, $scope.reset_password.new)
                        .then(function (data) {

                        })
                        .catch(function (error) {

                        });
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

                AuthService.isLoggedIn().$promise
                    .then(function (result) {
                        $scope.isLoggedIn = true;
                        $scope.profile = result;
                        album = $scope.profile.email;
                        $scope.getPhotos(album);
                        console.log(result);
                    })
                    .catch(function (error) {
                        $scope.isLoggedIn = false;
                    });

                $scope.getPhotos = function (album) {
                    PhotosService.getPhotos(album)
                        .then(function (data) {
                            $scope.profilePic = data[data.length];
                            $scope.profilePicUrl = $scope.profilePic.web_link;
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
                    PhotosService.deletePhoto(fileId)
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
                                PhotosService.uploadPhoto(album, file)
                                    .then(function (data) {
                                        console.log('uploadPhoto data', data);
                                        $scope.progress = false;
                                        // $scope.images.push(data);
                                        $scope.profilePicUrl = data.web_link;
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
