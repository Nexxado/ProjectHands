angular.module('ProjectHands.home')

    .directive('team', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/team.html',
            controller: function ($scope) {

                $scope.team = {
                    name: "",
                    role: "",
                    img_url: ""
                }
            }
        };
    });
