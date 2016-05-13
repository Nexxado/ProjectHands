angular.module('ProjectHands.home')

    .service("PhotoService", function ($resource) {



        // $(function(){
        //     var socket = iod.connect('http://0.0.0.0:5001');
        //
        //     socket.on('connect', function(){
        //         var delivery = new Delivery(socket);
        //
        //         delivery.on('delivery.connect',function(delivery){
        //             $("input[type=submit]").click(function(evt){
        //                 var file = $("input[type=file]")[0].files[0];
        //                 var extraParams = {foo: 'bar'};
        //                 delivery.send(file, extraParams);
        //                 evt.preventDefault();
        //             });
        //         });
        //
        //         delivery.on('send.success',function(fileUID){
        //             console.log("file was successfully sent.");
        //         });
        //     });
        // });

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
