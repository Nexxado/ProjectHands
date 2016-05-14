angular.module('ProjectHands.home')

    .directive('orgAds', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/org-ads.html',
            controller: function ($scope) {

                $scope.statistics = {
                    renovations : 10,
                    volunteers : 20,
                    work_hours : 300,
                    donations : 20000
                }
            }
        };
    });
