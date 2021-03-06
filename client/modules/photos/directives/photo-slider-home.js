angular.module('ProjectHands.photos')

    .directive('photoSliderHome', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {album: '@'},
            templateUrl: 'modules/photos/templates/directives/photo-slider-home.html',
            controller: function ($scope, $interval, PhotosService) {

                $scope.getPhotos = function (album) {
                    PhotosService.homeGet(album)
                        .then(function (data) {
                            if (data.length == 0)
                                setEmptyPhoto();
                            else
                                $scope.images = data;
                        })
                        .catch(function (error) {
                        });
                };
                $scope.getPhotos($scope.album);
                function setEmptyPhoto() {
                    $scope.images = [
                        {"web_link": "assets/img/nopicture.png"}
                    ]
                }
                
                $scope.direction = 'left';
                $scope.currentIndex = 0;
                $scope.setCurrentSlideIndex = function (index) {
                    $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
                    $scope.currentIndex = index;
                };
                $scope.isCurrentSlideIndex = function (index) {
                    return $scope.currentIndex === index;
                };
                $scope.prevSlide = function () {
                    $scope.direction = 'left';
                    $scope.currentIndex = ($scope.currentIndex < $scope.images.length - 1) ? ++$scope.currentIndex : 0;
                };
                $scope.nextSlide = function () {
                    $scope.direction = 'right';
                    $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.images.length - 1;
                };
                $scope.isMouseOver = false;
                var interval = 5000;
                $interval(function () {
                    if ($scope.isMouseOver === false)
                        $scope.prevSlide();
                }, interval);//
            }
        };
    }).animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width() * 2;
                if (scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done});
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width() * 2;
                if (scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, {left: startPoint}, {left: 0, onComplete: done});
            }
            else {
                done();
            }
        }
    };
});