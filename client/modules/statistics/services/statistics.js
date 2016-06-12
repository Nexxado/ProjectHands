angular.module('ProjectHands.statistics')
    .factory("StatisticsService", function ($rootScope, $resource, $cookies, $q) {

        var baseUrl = '/api/statistics';

        function getVolunteersCountPerDate(yearFrom, yearTo, monthFrom, monthTo, dayFrom, dayTo) {
            var date = {
                yearFrom: yearFrom,
                yearTo: yearTo,
                monthFrom: monthFrom,
                monthTo: monthTo,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/VolunteersCountPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsVolunteersNumberPerDate(yearFrom, yearTo, monthFrom, monthTo, dayFrom, dayTo) {
            var date = {
                yearFrom: yearFrom,
                yearTo: yearTo,
                monthFrom: monthFrom,
                monthTo: monthTo,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsVolunteersNumberPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsCostPerDate(yearFrom, yearTo, monthFrom, monthTo, dayFrom, dayTo) {
            var date = {
                yearFrom: yearFrom,
                yearTo: yearTo,
                monthFrom: monthFrom,
                monthTo: monthTo,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsCostPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsVolunteeringHoursPerDate(yearFrom, yearTo, monthFrom, monthTo, dayFrom, dayTo) {
            var date = {
                yearFrom: yearFrom,
                yearTo: yearTo,
                monthFrom: monthFrom,
                monthTo: monthTo,
                dayFrom: dayFrom,
                dayTo: dayTo
            };
            return $resource(baseUrl + '/renovationsVolunteeringHoursPerDate').get({date: JSON.stringify(date)});
        }

        function getRenovationsPerDate(yearFrom, yearTo, monthFrom, monthTo, dayFrom, dayTo) {
            var date = {
                yearFrom: yearFrom,
                yearTo: yearTo,
                monthFrom: monthFrom,
                monthTo: monthTo,
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