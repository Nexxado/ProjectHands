angular.module('ProjectHands.statistics')

    .controller('StatisticsController', function ($scope, StatisticsService) {

        var year = 2001;
        var month = 4;
        var day_s = 1;
        var day_e = 11;

        StatisticsService.getVolunteersCountPerDate(year, month, day_s, day_e)
            .$promise
            .then(function (result) {
                console.log('result ' + result.toString());
            })
            .catch(function (error) {
                console.log('error ' + error.toString());
            });


        StatisticsService.getRenovationsVolunteersNumberPerDate(year, month, day_s, day_e)
            .$promise
            .then(function (result) {
                console.log('result ' + result.toString());
            })
            .catch(function (error) {
                console.log('error ' + error.toString());
            });


        StatisticsService.getRenovationsCostPerDate(year, month, day_s, day_e)
            .$promise
            .then(function (result) {
                console.log('result ' + result.toString());
            })
            .catch(function (error) {
                console.log('error ' + error.toString());
            });


        StatisticsService.getRenovationsVolunteeringHoursPerDate(year, month, day_s, day_e)
            .$promise
            .then(function (result) {
                console.log('result ' + result.toString());
            })
            .catch(function (error) {
                console.log('error ' + error.toString());
            });


        StatisticsService.getRenovationsPerDate(year, month, day_s, day_e)
            .$promise
            .then(function (result) {
                console.log('result ' + result.toString());
            })
            .catch(function (error) {
                console.log('error ' + error.toString());
            });


    });
