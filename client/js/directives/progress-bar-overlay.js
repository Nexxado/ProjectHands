/**
 * Created by ND88-GS60 on 16/08/2016.
 */
angular.module('ProjectHands')
    .directive('progressBarOverlay', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/progress-bar-overlay.html',
            controller: function ($scope) {

                /**
                 * Disable Scrolling when overlay is active
                 */
                $scope.$watch('showLoadingSpinner', function (newVal, oldVal, scope) {
                    angular.element('body').css('overflow', newVal ? 'hidden' : '');
                });
            }
        };
    });