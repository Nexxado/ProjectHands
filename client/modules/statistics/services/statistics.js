angular.module('ProjectHands.statistics')
    .factory("StatisticsService", function ($rootScope, $resource, $cookies, $q) {

        var baseUrl = '/api/statistics';

        function getVolunteersCountPerDate(year, month, dayFrom, dayTo) {
            return $resource(baseUrl + '/VolunteersCountPerDate').get({
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            });
        }

        function getRenovationsVolunteersNumberPerDate(year, month, dayFrom, dayTo) {
            return $resource(baseUrl + '/renovationsVolunteersNumberPerDate').get({
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            });
        }

        function getRenovationsCostPerDate(year, month, dayFrom, dayTo) {
            return $resource(baseUrl + '/renovationsCostPerDate').get({
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            });
        }

        function getRenovationsVolunteeringHoursPerDate(year, month, dayFrom, dayTo) {
            return $resource(baseUrl + '/renovationsVolunteeringHoursPerDate').get({
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            });
        }

        function getRenovationsPerDate(year, month, dayFrom, dayTo) {
            return $resource(baseUrl + '/renovationsPerDate').get({
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            });
        }

    });