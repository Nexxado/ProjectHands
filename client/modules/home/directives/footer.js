angular.module('ProjectHands.home')

    .directive('statistics', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/statistics.html',
            controller: function ($scope) {
            

            }
        };
    });
