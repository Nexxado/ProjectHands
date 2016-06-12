angular.module('ProjectHands.statistics')

    .directive('datePicker', function () {
        return {
            restrict: 'E',
            replace: true,
            scope : {
                obj : "=ngModel"
            },
            templateUrl: 'modules/statistics/templates/directives/date-picker.html',
            controller: function ($scope) {


                console.log($scope.obj);

             

            }
        };
    });
