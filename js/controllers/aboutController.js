angular.module('ProjectHands')

.controller("AboutController", function ($scope) {
    $scope.carouselInterval = 5000;

    $scope.active = 0;

    $scope.slides = [{
            id: 0,
            img: 'assets/img/jobs1.jpg'
        }, {
            id: 1,
            img: 'assets/img/jobs2.jpg'
        }, {
            id: 2,
            img: 'assets/img/jobs3.jpg'
        },{
            id: 3,
            img: 'assets/img/jobs4.jpg'
        },{
            id: 4,
            img: 'assets/img/jobs5.jpg'
        },{
            id: 5,
            img: 'assets/img/jobs6.jpg'
        },{
            id: 6,
            img: 'assets/img/jobs7.jpg'
        },{
            id: 7,
            img: 'assets/img/jobs8.jpg'
        },{
            id: 8,
            img: 'assets/img/jobs9.jpg'
        }
    ];

});
