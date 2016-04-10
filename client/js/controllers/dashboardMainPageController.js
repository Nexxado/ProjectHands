angular.module('ProjectHands')

.controller('DashboardMainPageController', function ($scope) {
    $scope.gridItems = [
        {
            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 0
        },
        {
            sizeX: 2,
            sizeY: 2,
            row: 0,
            col: 2
        },
        {
            sizeX: 2,
            sizeY: 1,
            row: 2,
            col: 0
        },
        {
            sizeX: 2,
            sizeY: 2,
            row: 2,
            col: 2
        },
        {
            sizeX: 2,
            sizeY: 1,
            row: 4,
            col: 0
        },
        {
            sizeX: 2,
            sizeY: 2,
            row: 4,
            col: 2
        }

];
});
