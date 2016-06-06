var mongoUtils = require('./mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var HttpStatus = require('http-status-codes');


setTimeout(mongoUtils.connect(config.mongoDBUrl)
    , 500);
setTimeout(function () {
        getRenovationsVolunteeringHoursPerDate(2016, "01", "01", 30, function (error, result) {

            if (error) {
                console.log("Some error had happend");
            }
            else {
                console.log(result);
            }
        })

    }
    , 3000);


/**
 *Get total Money spent on renovations in time period
 *
 * @param year {int} : the year to be quered
 * @param month {int} : the month to be quered
 * @param dayFrom {int}  : start day on the month
 * @param dayTo {int} : end day on the month
 * @param callback : Object[][renovationName:renovationMoney , totalCost:thecosts]
 */
function getRenovationsVolunteeringHoursPerDate(year, month, dayFrom, dayTo, callback) {
    getRenovationsPerDate(year, month, dayFrom, dayTo, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            if (result === "NO RESULTS") {
                callback(error, "NO RESULTS");
            }
            else {
                /**THE FLOW
                 * 1- loop on the renovations
                 * 2- get the cost from them[ costMap {item_name : cost}
                 * 3- return it
                 * */
                var totalCost = 0;
                var costData = {};
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
                costData["totalCost"] = totalCost;
                callback(error, totalHours);

            }
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

    var costMapObject = renovation.moneyMap;
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
    getRenovationsPerDate(year, month, dayFrom, dayTo, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            if (result === "NO RESULTS") {
                callback(error, "NO RESULTS");
            }
            else {
                /**THE FLOW
                 * 1- loop on the renovations
                 * 2- get the hours from them[ hoursMap {user_id : hours_in_this_renovation}
                 * 3- return it
                 * */
                var totalHours = 0;
                var hoursData = {};
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

                    hoursData["totalHours"] = totalHours;
                }
                callback(error, hoursData);

            }
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
//TODO: check what is the Date field name in the renovations
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
    /**
     * The flow
     * 1- get renovations within this date
     * return it
     * */
    mongoUtils.query(COLLECTIONS.RENOVATIONS,
        {
            date: {
                // $gte: new Date(year + '-' + month + '-' + dayFrom + 'T00:00:00Z'),
                // $lt: new Date(year + '-' + month + '-' + dayTo + 'T00:00:00Z')
                $gte: new Date('2016-06-01T00:00:00Z'),
                $lt: new Date('2016-06-30T00:00:00Z')
            }
        },
        function (error, result) {
            if (error) {
                callback(error, "DB FETCH ERROR");
            }
            else {
                if (result.length == 0) {
                    callback(error, "NO RESULTS");
                }
                else {
                    callback(error, result);
                }

            }
        });
}

module.exports = {}
