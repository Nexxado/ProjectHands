angular.module('ProjectHands.statistics')
    .factory("StatisticsService", function ($rootScope, $resource, $cookies, $q) {

        var baseUrl = '/api/statistics';

        function getVolunteersCountPerDate(year, month, dayFrom, dayTo) {
            var date = {
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/VolunteersCountPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsVolunteersNumberPerDate(year, month, dayFrom, dayTo) {
            var date = {
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsVolunteersNumberPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsCostPerDate(year, month, dayFrom, dayTo) {
            var date = {
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsCostPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsVolunteeringHoursPerDate(year, month, dayFrom, dayTo) {
            var date = {
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsVolunteeringHoursPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsPerDate(year, month, dayFrom, dayTo) {
            var date = {
                year: year,
                month: month,
                dayFrom: dayFrom,
                dayTo: dayTo
            };

            return $resource(baseUrl + '/renovationsPerDate').get({date: JSON.stringify(date)});
        }

        return {
            getVolunteersCountPerDate: getVolunteersCountPerDate,
            getRenovationsVolunteersNumberPerDate: getRenovationsVolunteersNumberPerDate,
            getRenovationsCostPerDate: getRenovationsCostPerDate,
            getRenovationsVolunteeringHoursPerDate: getRenovationsVolunteeringHoursPerDate,
            getRenovationsPerDate: getRenovationsPerDate
        };

    });