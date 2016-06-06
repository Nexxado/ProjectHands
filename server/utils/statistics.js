var mongoUtils = require('./mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
const NO_RESULTS = "NO RESULTS";
const INVALID_DATE = "Invalid Date";

/**
 * Convert any number from 1-9 to "01" ~  "09" so Date can read it
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @returns {Object} : contains the fields in string format
 */
function parseDateToStringFormat(year, month, dayFrom, dayTo) {
    var date = {};
    date["year"] = "" + year;
    if (month > 1 && month < 10) {
        date["month"] = "0" + month;
    }
    else {
        date["month"] = month;
    }
    if (dayFrom >= 1 && dayFrom < 10) {
        date["dayFrom"] = "0" + dayFrom;
    }
    else {
        date["dayFrom"] = "" + dayFrom;
    }
    if (dayTo >= 1 && dayTo < 10) {
        date["dayTo"] = "0" + dayTo;
    }
    else {
        date["dayTo"] = "" + dayTo;
    }
    return date;

}
/**
 *Get number of registered Volunteers per period
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback
 */
function getVolunteersCountPerDate(year, month, dayFrom, dayTo, callback) {
    var date = parseDateToStringFormat(year, month, dayFrom, dayTo);
    year = date.year;
    month = date.month;
    dayFrom = date.dayFrom;
    dayTo = date.dayTo;

    var dateFrom = new Date(year + '-' + month + '-' + dayFrom + 'T00:00:00Z');
    var dateTo = new Date(year + '-' + month + '-' + dayTo + 'T00:00:00Z');
    if (dateTo == INVALID_DATE || dateFrom == INVALID_DATE) {
        callback(null, 0)
    }
    else {

        mongoUtils.query(COLLECTIONS.USERS,
            {
                joined_date: {
                    // $gte: new Date(year + '-' + month + '-' + dayFrom + 'T00:00:00Z'),
                    // $lt: new Date(year + '-' + month + '-' + dayTo + 'T00:00:00Z')
                    $gte: dateFrom,
                    $lt: dateTo
                }
            },
            function (error, result) {
                if (error) {
                    callback(error, DB_DETCH_ERROR);
                }
                else {

                    callback(error, result.length);
                }
            }, {_id: true});
    }

}
/**
 *Get total Money spent on renovations in time period
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback : Object[][renovationName:numberOfVolunteers , totalVolunteers:theWholeNumberOfColunteers]
 */
function getRenovationsVolunteersNumberPerDate(year, month, dayFrom, dayTo, callback) {
    var date = parseDateToStringFormat(year, month, dayFrom, dayTo);
    year = date.year;
    month = date.month;
    dayFrom = date.dayFrom;
    dayTo = date.dayTo;
    getRenovationsPerDate(year, month, dayFrom, dayTo, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            var totalVolunteers = 0;
            var volunteersData = {};

            if (result !== NO_RESULTS) {
                /**THE FLOW
                 * 1- loop on the renovations
                 * 2- get the number of workers from hoursMap
                 * 3- return it
                 * */

                for (var i = 0; i < result.length; i++) {
                    var renovation = result[i];
                    if (renovation.hoursMap != undefined) {
                        var volunteersNumber = Object.keys(renovation.hoursMap).length;
                        volunteersData[renovation.name] = volunteersNumber;
                        totalVolunteers += volunteersNumber;
                    }
                    else {
                        volunteersData[renovation.name] = 0;
                    }
                }
            }
            volunteersData["totalVolunteers"] = totalVolunteers;
            callback(error, volunteersData);
        }

    });
}

/**
 *Get total Money spent on renovations in time period
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback : Object[][renovationName:renovationMoney , totalCost:thecosts]
 */
function getRenovationsCostPerDate(year, month, dayFrom, dayTo, callback) {
    var date = parseDateToStringFormat(year, month, dayFrom, dayTo);
    year = date.year;
    month = date.month;
    dayFrom = date.dayFrom;
    dayTo = date.dayTo;
    getRenovationsPerDate(year, month, dayFrom, dayTo, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            var totalCost = 0;
            var costData = {};

            if (result !== NO_RESULTS) {

                /**THE FLOW
                 * 1- loop on the renovations
                 * 2- get the cost from them[ costMap {item_name : cost}
                 * 3- return it
                 * */
                for (var i = 0; i < result.length; i++) {
                    var renovation = result[i];
                    if (renovation.costMap != undefined) {
                        var renovationCost = getRenovationCost(renovation);
                        costData[renovation.name] = renovationCost;
                        totalCost += renovationCost;
                    }
                    else {
                        costData[renovation.name] = 0;
                    }
                }
            }
            costData["totalCost"] = totalCost;
            callback(error, costData);
        }

    });
}

/**
 *Get the cost of  renovation
 *
 * @param renovation  {Object} : the renovation that we to calc its cost
 * @returns {number} : the total costs
 */
function getRenovationCost(renovation) {

    var costMapObject = renovation.costMap;
    var totalCost = 0;

    for (var key in costMapObject) {
        var money = costMapObject[key];
        totalCost += money;
    }
    return totalCost;
}

/**
 *Get total hours of volunteering in renovations in time period
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback : Object[renovationName,renovationHours]
 */
function getRenovationsVolunteeringHoursPerDate(year, month, dayFrom, dayTo, callback) {
    var date = parseDateToStringFormat(year, month, dayFrom, dayTo);
    year = date.year;
    month = date.month;
    dayFrom = date.dayFrom;
    dayTo = date.dayTo;

    getRenovationsPerDate(year, month, dayFrom, dayTo, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            var totalHours = 0;
            var hoursData = {};
            if (result !== NO_RESULTS) {
                /**THE FLOW
                 * 1- loop on the renovations
                 * 2- get the hours from them[ hoursMap {user_id : hours_in_this_renovation}
                 * 3- return it
                 * */

                for (var i = 0; i < result.length; i++) {
                    var renovation = result[i];
                    if (renovation.hoursMap != undefined) {
                        var renovationHours = getRenovationVolunteeringHours(renovation);
                        hoursData[renovation.name] = renovationHours;
                        totalHours += renovationHours;
                    }
                    else {
                        hoursData[renovation.name] = 0;
                    }
                }
            }
            hoursData["totalHours"] = totalHours;
            callback(error, hoursData);

        }

    });
}
/**
 *Get the hours of volunteering in renovation
 *
 * @param renovation  {Object} : the renovation that we to calc it hours
 * @returns {number} : the total hours
 */
function getRenovationVolunteeringHours(renovation) {

    var hoursMapObject = renovation.hoursMap;
    var totalHours = 0;

    for (var key in hoursMapObject) {
        var hours = hoursMapObject[key];
        totalHours += hours;
    }
    return totalHours;
}
/**
 *Get the renovation that fall in the specified date
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback : Object[] with the renovations
 */
function getRenovationsPerDate(year, month, dayFrom, dayTo, callback) {
    var date = parseDateToStringFormat(year, month, dayFrom, dayTo);
    year = date.year;
    month = date.month;
    dayFrom = date.dayFrom;
    dayTo = date.dayTo;

    var dateFrom = new Date(year + '-' + month + '-' + dayFrom + 'T00:00:00Z');
    var dateTo = new Date(year + '-' + month + '-' + dayTo + 'T00:00:00Z');

    /**
     * The flow
     * 1- get renovations within this date
     * return it
     * */
    if (dateTo == INVALID_DATE || dateFrom == INVALID_DATE) {
        callback(null, NO_RESULTS);
    }
    else {
        mongoUtils.query(COLLECTIONS.RENOVATIONS,
            {
                date: {
                    $gte: dateFrom,
                    $lt: dateTo
                }
            },
            function (error, result) {
                if (error) {
                    callback(error, DB_DETCH_ERROR);
                }
                else {
                    if (result.length == 0) {
                        callback(error, NO_RESULTS);
                    }
                    else {
                        callback(error, result);
                    }

                }
            });
    }
}

module.exports = {

    getVolunteersCountPerDate: getVolunteersCountPerDate,
    getRenovationsVolunteersNumberPerDate: getRenovationsVolunteersNumberPerDate,
    getRenovationsCostPerDate: getRenovationsCostPerDate,
    getRenovationsVolunteeringHoursPerDate: getRenovationsVolunteeringHoursPerDate,
    getRenovationsPerDate: getRenovationsVolunteeringHoursPerDate

}
