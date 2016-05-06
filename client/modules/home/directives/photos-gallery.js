angular.module('ProjectHands.home')

    .directive('photosGallery', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/photos-gallery.html',
            controller: function ($scope, fileUpload) {

                $scope.uploadFile = function(){
                    var file = $scope.myFile;

                    console.log('file is ' );
                    console.dir(file);

                    var uploadUrl = "/fileUpload";
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                };

            }
        };
    });