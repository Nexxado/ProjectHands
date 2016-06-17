angular.module('ProjectHands.home')

    .directive('orgAdsPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/org-ads-panel.html',
            controller: function ($scope, HomeService) {
                
                $scope.ad = {
                    title: '',
                    content: ''
                };
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
                
                $scope.upload = function (title, content) {

                    if ($scope.adsForm.$invalid)
                        return;

                    HomeService.uploadAd(title, content)
                        .then(function (result) {
                            $scope.ads.push(result.ops[0]);
                            resetForm();
                        })
                        .catch(function (error) {
                        });
                };
                function resetForm() {
                    $scope.ad = {
                        title: '',
                        content: ''
                    };
                }
                $scope.deleteAd = function (id, index) {
                    HomeService.deleteAd(id)
                        .then(function (result) {
                            $scope.ads.splice(index, 1);

                        })
                        .catch(function (error) {
                        });
                }
            }
        };

    });
