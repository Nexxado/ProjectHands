angular.module('ProjectHands.home')

    .directive('statistics', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/statistics.html',
            controller: function ($scope) {

                //mock obj
                $scope.statistics = {
                    renovations : 10,
                    volunteers : " "+20,
                    work_hours : " "+300,
                    donations : " "+20000
                }

            }
        };
    });
