angular.module('ProjectHands.home')

    .directive('orgAds', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/org-ads.html',
            controller: function ($scope, HomeService) {
                $scope.ads = [];
                $scope.getAds = function () {
                    HomeService.getAds()
                        .then(function (result) {
                            $scope.ads = result;
                        })
                        .catch(function (error) {
                        });
                };
                $scope.getAds();
            }
        };
    });
