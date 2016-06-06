angular.module('ProjectHands.photos')

    .directive('photos', function () {
        return {
            restrict: 'E',
            scope: {album: '@'},
            replace: true,
            templateUrl: 'modules/photos/templates/directives/photos.html',
            controller: function ($scope, Upload, $timeout, PhotosService, $mdDialog, $mdMedia) {

                var dialogImgUrl = "";

                function DialogController($scope, $mdDialog) {
                    $scope.dialogImgUrl = dialogImgUrl;
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                };

                $scope.showImageDialog = function (ev, imageUrl) {
                    dialogImgUrl = imageUrl;
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'modules/photos/templates/dialog/photo-dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen
                    })
                        .then(function (answer) {
                            $scope.status = 'You said the information was "' + answer + '".';
                        }, function () {
                            $scope.status = 'You cancelled the dialog.';
                        });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                };

                $scope.isEditMode = false;

                $scope.changeMode = function () {
                    $scope.isEditMode = !$scope.isEditMode;
                };

                $scope.getPhotos = function (album) {
                    PhotosService.getPhotos(album)
                        .then(function (data) {
                            console.log('getPhotos data', data);
                            $scope.images = data;
                        })
                        .catch(function (error) {

                            console.log('getPhotos error ', error);
                        });
                };
                
                $scope.getPhotos($scope.album);

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
                $scope.log = '';

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
                                PhotosService.uploadPhoto($scope.album, file)
                                    .then(function (data) {
                                        console.log('uploadPhoto data', data);
                                        $scope.progress = false;
                                        $scope.images.push(data);
                                    })
                                    .catch(function (error) {
                                        console.log('uploadPhoto error ', error);
                                        $scope.progress = false;
                                    });

                                // Upload.upload({
                                //     url: '/api/photos/uploads',
                                //     data: {
                                //         // username: $scope.username,
                                //         album: $scope.album,
                                //         file: file
                                //     }
                                // }).then(function (resp) {
                                //     $timeout(function () {
                                //         $scope.log = 'file: ' +
                                //             resp.config.data.file.name +
                                //             ', Response: ' + JSON.stringify(resp.data) +
                                //             '\n' + $scope.log;
                                //         // $scope.photoSrc = (resp.data).replace(/['"]+/g, '');
                                //         $scope.images.push(resp.data);
                                //         $scope.progress = false;
                                //     });
                                // }, null, function (evt) {
                                //     // $scope.progress = false;
                                //     var progressPercentage = parseInt(100.0 *
                                //         evt.loaded / evt.total);
                                //     $scope.log = 'progress: ' + progressPercentage +
                                //         '% ' + evt.config.data.file.name + '\n' +
                                //         $scope.log;
                                //
                                //
                                // });
                            }
                        }
                    }
                };

            }
        };
    });