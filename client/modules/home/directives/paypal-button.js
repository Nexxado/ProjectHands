angular.module('ProjectHands.home')

    .directive('paypalButton', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/paypal-button.html',
            controller: function ($scope, $timeout) {


            }
        };
    });
