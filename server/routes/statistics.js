var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var statisticsUtils = require('../utils/statistics');
var debug = require('debug')('routes/statistics');
var config = require('../../config.json');
var writeToClient = require('../utils/writeToClient');
var middleware = require('../utils/middleware');

router.get('/VolunteersCountPerDate/:date', /* middleware.ensureAuthenticated,middleware.ensurePermission,*/
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getVolunteersCountPerDate(date.year, date.month, date.dayFrom, date.dayTo, function (error, result) {
                writeToClient(res, result + "");
            });
        }
        catch (e) {
            writeToClient(res, null, "Error: Failed to get volunteers count", HttpStatus.BAD_REQUEST);
            debug("VolunteersCountPerDate error: ", error);
        }
    });


router.get('/renovationsVolunteersNumberPerDate/:date', /* middleware.ensureAuthenticated,middleware.ensurePermission,*/
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsVolunteersNumberPerDate(date.year, date.month, date.dayFrom, date.dayTo, function (error, result) {
                writeToClient(res, result);
            });
        }
        catch (e) {
            writeToClient(res, null, "Error: Failed to get volunteers count per renovation", HttpStatus.BAD_REQUEST);
            debug("renovationsVolunteersNumberPerDate error: ", error);
        }
    });

router.get('/renovationsCostPerDate/:date', /* middleware.ensureAuthenticated,middleware.ensurePermission,*/
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsCostPerDate(date.year, date.month, date.dayFrom, date.dayTo, function (error, result) {
                writeToClient(res, result);
            });
        }
        catch (e) {
            writeToClient(res, null, "Error: Failed to get cost per renovation", HttpStatus.BAD_REQUEST);
            debug("getRenovationsCostPerDate error: ", error);
        }
    });

router.get('/renovationsVolunteeringHoursPerDate/:date', /* middleware.ensureAuthenticated,middleware.ensurePermission,*/
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsVolunteeringHoursPerDate(date.year, date.month, date.dayFrom, date.dayTo, function (error, result) {
                writeToClient(res, result);
            });
        }
        catch (e) {
            writeToClient(res, null, "Error: Failed to get volunteering hours per renovation", HttpStatus.BAD_REQUEST);
            debug("getRenovationsVolunteeringHoursPerDate error: ", error);
        }
    });

router.get('/renovationsPerDate/:date', /* middleware.ensureAuthenticated,middleware.ensurePermission,*/
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsPerDate(date.year, date.month, date.dayFrom, date.dayTo, function (error, result) {
                writeToClient(res, result);
            });
        }
        catch (e) {
            writeToClient(res, null, "Error: Failed to get renovations for the specified date", HttpStatus.BAD_REQUEST);
            debug("getRenovationsPerDate error: ", error);
        }
    });

module.exports = router;
