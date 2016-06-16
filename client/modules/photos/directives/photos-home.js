angular.module('ProjectHands.photos')

    .directive('photosHome', function () {
        return {
            restrict: 'E',
            scope: {album: '@'},
            replace: true,
            templateUrl: 'modules/photos/templates/directives/photos-home.html',
            controller: function ($scope, Upload, $timeout, PhotosService, $mdDialog, $mdMedia) {

                var dialogImgUrl = "";
                $scope.isEditMode = false;
                $scope.progress = false;
                $scope.progressDelete = false;
                $scope.log = '';
                
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
                $scope.changeMode = function () {
                    $scope.isEditMode = !$scope.isEditMode;
                };
                $scope.getPhotos = function (album) {
                    PhotosService.homeGet(album)
                        .then(function (data) {
                            $scope.images = data;
                        })
                        .catch(function (error) {
                        });
                };
                $scope.getPhotos($scope.album);
                
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
                    PhotosService.homeDelete(fileId)
                        .then(function (data) {
                            $scope.images.splice(index, 1);
                        })
                        .catch(function (error) {
                        });
                }
                $scope.upload = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            if (!file.$error) {
                                $scope.progress = true;
                                PhotosService.homeUpload($scope.album, file)
                                    .then(function (data) {
                                        $scope.progress = false;
                                        $scope.images.push(data);
                                    })
                                    .catch(function (error) {
                                        $scope.progress = false;
                                    });
                            }
                        }
                    }
                };

            }
        };
    });