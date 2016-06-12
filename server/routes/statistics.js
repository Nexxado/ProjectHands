var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var statisticsUtils = require('../utils/statistics');
var debug = require('debug')('routes/statistics');
var middleware = require('../utils/middleware');

router.get('/VolunteersCountPerDate/:date', middleware.ensureAuthenticated, middleware.ensurePermission,
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getVolunteersCountPerDate(date.yearFrom, date.yearTo, date.monthFrom, date.monthTo, date.dayFrom, date.dayTo, function (error, result) {
                res.send("" + result);
            });
        }
        catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: Failed to get volunteers count"});
            debug("VolunteersCountPerDate error: ", error);
        }
    });


router.get('/renovationsVolunteersNumberPerDate/:date', middleware.ensureAuthenticated, middleware.ensurePermission,
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsVolunteersNumberPerDate(date.yearFrom, date.yearTo, date.monthFrom, date.monthTo, date.dayFrom, date.dayTo, function (error, result) {
                res.send(result);
            });
        }
        catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: Failed to get volunteers count per renovation"});
            debug("renovationsVolunteersNumberPerDate error: ", error);
        }
    });

router.get('/renovationsCostPerDate/:date', middleware.ensureAuthenticated, middleware.ensurePermission,
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsCostPerDate(date.yearFrom, date.yearTo, date.monthFrom, date.monthTo, date.dayFrom, date.dayTo, function (error, result) {
                res.send(result);
            });
        }
        catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: Failed to get cost per renovation"});
            debug("getRenovationsCostPerDate error: ", error);
        }
    });

router.get('/renovationsVolunteeringHoursPerDate/:date', middleware.ensureAuthenticated, middleware.ensurePermission,
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsVolunteeringHoursPerDate(date.yearFrom, date.yearTo, date.monthFrom, date.monthTo, date.dayFrom, date.dayTo, function (error, result) {
                res.send(result);
            });
        }
        catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: Failed to get volunteering hours per renovation"});
            debug("getRenovationsVolunteeringHoursPerDate error: ", error);
        }
    });

router.get('/renovationsPerDate/:date', middleware.ensureAuthenticated, middleware.ensurePermission,
    function (req, res) {
        try {
            var date = JSON.parse(req.params.date);
            debug("request data : ", date);
            statisticsUtils.getRenovationsPerDate(date.yearFrom, date.yearTo, date.monthFrom, date.monthTo, date.dayFrom, date.dayTo, function (error, result) {
                res.send(result);
            });
        }
        catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: Failed to get renovations for the specified date"});
            debug("getRenovationsPerDate error: ", error);
        }
    });

module.exports = router;
