angular.module('ProjectHands.home')

    .service("PhotoService", function ($resource) {
        
        var slides = [
            {image: 'assets/img/home/jobs1.jpg', description: 'Image 00'},
            {image: 'assets/img/home/jobs2.jpg', description: 'Image 01'},
            {image: 'assets/img/home/jobs3.jpg', description: 'Image 02'},
            {image: 'assets/img/home/jobs4.jpg', description: 'Image 04'},
            {image: 'assets/img/home/jobs5.jpg', description: 'Image 05'},
            {image: 'assets/img/home/jobs6.jpg', description: 'Image 06'},
            {image: 'assets/img/home/jobs7.jpg', description: 'Image 07'},
            {image: 'assets/img/home/jobs8.jpg', description: 'Image 08'},
            {image: 'assets/img/home/jobs9.jpg', description: 'Image 09'}
        ];

        this.savePhoto = function()  {

        }

        this.deletePhoto =  function () {

        }

        this.getPhotoList = function () {
            return slides;
        }
    });
