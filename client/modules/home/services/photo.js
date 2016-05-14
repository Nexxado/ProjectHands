angular.module('ProjectHands.home')

    .service("PhotoService", function ($resource) {
        
        var slides = [
            {image: 'assets/img/home/jobs1.jpg', description: 'Image 00'},
            {image: 'assets/img/home/jobs2.jpg', description: 'Image 01'},
            {image: 'assets/img/home/jobs3.jpg', description: 'Image 02'},
            {image: 'assets/img/home/jobs5.jpg', description: 'Image 04'}
        ];

        this.savePhoto = function()  {

        }

        this.deletePhoto =  function () {

        }

        this.getPhotoList = function () {
            return slides;
        }
    });
