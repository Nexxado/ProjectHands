angular.module('ProjectHands.statistics')

    .controller('StatisticsController', function ($scope, StatisticsService) {

        $scope.startDate = new Date();
        $scope.endDate = new Date();

        $scope.volunteersCount = '';
        $scope.renovationsVolunteersNumber = '';
        $scope.renovationsCost = '';
        $scope.renovationsVolunteeringHours = '';
        $scope.renovations = '';

        $scope.fixDate = function (date) {
            return date.split("T")[0];
        };
        $scope.submit = function () {

            if ($scope.startDateForm.$invalid || $scope.endDateForm.$invalid)
                return;

            var startYear = $scope.startDate.getFullYear();
            var startMonth = $scope.startDate.getMonth() + 1;
            var startDay = $scope.startDate.getDate();

            var endYear = $scope.endDate.getFullYear();
            var endMonth = $scope.endDate.getMonth() + 1;
            var endDay = $scope.endDate.getDate();

            console.log(startYear);
            console.log(startMonth);
            console.log(startDay);
            console.log(endYear);
            console.log(endMonth);
            console.log(endDay);

            StatisticsService.getVolunteersCountPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.volunteersCount = result;
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });

            StatisticsService.getRenovationsVolunteersNumberPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsVolunteersNumber = result.totalVolunteers;
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsCostPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsCost = result.totalCost;
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsVolunteeringHoursPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovationsVolunteeringHours = result.totalHours;
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });


            StatisticsService.getRenovationsPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ' + result.toString());
                    $scope.renovations = result.result;
                })
                .catch(function (error) {
                    console.log('error ' + error.toString());
                });

        };

    });
