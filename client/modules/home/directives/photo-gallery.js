angular.module('ProjectHands.home')

    .directive('photoGallery', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/photo-gallery.html',
            controller: function ($scope, fileUpload, PhotoService) {

                
                
                $scope.savePhoto = function () {
                    PhotoService.savePhoto();
                }

                $scope.deletePhoto = function () {
                    PhotoService.deletePhoto();
                }

                $scope.getPhotoList = function () {
                    return PhotoService.getPhotoList();
                }
                $scope.slides  = PhotoService.getPhotoList();

                // $scope.slides = [
                //     {image: 'assets/img/home/jobs1.jpg', description: 'Image 00'},
                //     {image: 'assets/img/home/jobs2.jpg', description: 'Image 01'},
                //     {image: 'assets/img/home/jobs3.jpg', description: 'Image 02'},
                //     {image: 'assets/img/home/jobs5.jpg', description: 'Image 04'}
                // ];
                
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