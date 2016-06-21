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
            if(!date)
                return 'אין';

            return date.split("T")[0];
        };

        //if its no data in the filed print no data
        $scope.noData = function (s) {
            if (s === '')
                return 'NO DATA';
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
                    console.log('result ', result);
                    $scope.volunteersCount = result.result;
                })
                .catch(function (error) {
                    console.error('error ', error);
                });

            StatisticsService.getRenovationsVolunteersNumberPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ', result);
                    $scope.renovationsVolunteersNumber = result.totalVolunteers;
                })
                .catch(function (error) {
                    console.error('error ', error);
                });


            StatisticsService.getRenovationsCostPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ', result);
                    $scope.renovationsCost = result.totalCost;
                })
                .catch(function (error) {
                    console.error('error ', error);
                });


            StatisticsService.getRenovationsVolunteeringHoursPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('result ', result);
                    $scope.renovationsVolunteeringHours = result.totalHours;
                })
                .catch(function (error) {
                    console.error('error ', error);
                });


            StatisticsService.getRenovationsPerDate(startYear, endYear, startMonth, endMonth, startDay, endDay)
                .$promise
                .then(function (result) {
                    console.log('getRenovationsPerDate result ', result);
                    if(result.result && !Array.isArray(result))
                        $scope.renovations = [];
                    else
                        $scope.renovations = result.result;
                })
                .catch(function (error) {
                    console.error('error ', error);
                });

        };

    });
