angular.module('ProjectHands')

.controller('HomeController', function($scope) {
    
    $scope.carouselInterval = 5000;
    
    $scope.active = 0;
    
    $scope.slides = [{
            id: 0,
            img: 'assets/img/project.slide.1.jpg'
        } , {
            id: 1,
            img: 'assets/img/project.slide.2.jpg'
        } , {
            id: 2,
            img: 'assets/img/project.slide.3.jpg'
        }
    ];
    
});