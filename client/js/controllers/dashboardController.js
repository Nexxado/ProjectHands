angular.module('ProjectHands')

.controller('DashboardController', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
});
