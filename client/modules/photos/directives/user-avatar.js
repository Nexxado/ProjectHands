angular.module('ProjectHands.photos')

    .directive('userAvatar', function () {
        return {
            restrict: 'E',
            scope: {album: '@'},
            replace: true,
            templateUrl: 'modules/photos/templates/directives/user-avatar.html',
            controller: function ($scope, Upload, $timeout, PhotosService, AuthService, $mdDialog, $mdMedia) {

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

                $scope.userHaveProfilePic = false;
                var album = '';
                $scope.profilePic = {};
                $scope.profilePicUrl = {};
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

            }
        };
    });