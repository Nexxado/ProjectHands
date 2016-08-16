/**
 * Created by ND88-GS60 on 16/08/2016.
 */
angular.module('ProjectHands')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                toggle: '=',
                inline: '@?',
                element: '@?'
            },
            templateUrl: '/templates/directives/spinner.html',
            link: function (scope, element, attrs) {
                /**
                 * Display spinner inline parent div
                 */
                if (scope.inline !== undefined) {
                    element.css('height', '100%');
                    element.css('background-color', 'transparent');
                }
            },
            controller: function ($scope, $timeout) {

                /**
                 * Disable Scrolling when Spinner is active
                 */
                $scope.$watch('toggle', function (newVal, oldVal, scope) {
                    var body = angular.element($scope.element || 'body');
                    body.css('overflow', newVal ? 'hidden' : '');

                    $timeout(function (position) {
                        angular.element('.spinner-container').css('top', position);
                    }, 1, true, body.scrollTop());
                });
            }
        };
    });