angular.module('ProjectHands.statistics')

    .controller('StatisticsController', function ($scope, StatisticsService) {

        $scope.startDate = new Date();
        $scope.endDate = new Date();

        $scope.VolunteersCount = '';
        $scope.renovationsVolunteersNumber = '';
        $scope.renovationsCost = '';
        $scope.renovationsVolunteeringHours = '';
        $scope.renovations = '';

        $scope.submit = function () {

            if ($scope.startDateForm.$invalid || $scope.endDateForm.$invalid)
                return;

            console.log($scope.startDate.getUTCDate());

            var startYear = $scope.startDate.getFullYear();
            var startMonth = $scope.startDate.getMonth();
            var startDay = $scope.startDate.getUTCDate();

            var endYear = $scope.endDate.getFullYear();
            var endMonth = $scope.endDate.getMonth();
            var endDay = $scope.endDate.getUTCDate();

            console.log($scope.endDate);

            $scope.VolunteersCountPerDate = '';
            StatisticsService.getVolunteersCountPerDate(startYear, startMonth, startDay, startDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.VolunteersCount = result.toString();
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });

            StatisticsService.getRenovationsVolunteersNumberPerDate(startYear, startMonth, startDay, startDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsVolunteersNumber = result.toString();
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsCostPerDate(startYear, startMonth, startDay, startDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsCost = result.toString();
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsVolunteeringHoursPerDate(startYear, startMonth, startDay, startDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsVolunteeringHours = result.toString();
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsPerDate(startYear, startMonth, startDay, startDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovations = result.toString();
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });

        };






    });
