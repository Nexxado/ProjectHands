var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var mongoUtils = require('../utils/mongo');
var debug = require('debug')('routes/database');
var writeToClient = require('../utils/writeToClient');


router.post("/insert", ensureAuthenticated, function (request, response) {

    debug('insert col', request.body.collection);
    debug('insert data', request.body.data);

    try {
        var colName = request.body.collection;
        var dataObj = JSON.parse(request.body.data);
        mongoUtils.insert(colName, dataObj, function (error, result) {
            if(error)
                return writeToClient(response, result, error, HttpStatus.INTERNAL_SERVER_ERROR);

            writeToClient(response, result);
        });
    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }

});

/**
 * http://localhost:8080/api/delete/users?query={%22username%22:%22test%22}
 * */
router.delete("/delete/:collection&:query", ensureAuthenticated, function (request, response) {
    try {
        debug('delete col', request.params.collection);
        debug('delete data', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.delete(colName, query, function (error, result) {
            if(error)
                return writeToClient(response, result, error, HttpStatus.INTERNAL_SERVER_ERROR);

            writeToClient(response, result);
        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }


});


router.post("/update", ensureAuthenticated, function (request, response) {
    debug(request.body.collection);
    debug(request.body.query);
    debug(request.body.data);
    debug(request.body.options);

    try {
        var colName = request.body.collection;
        var query = JSON.parse(request.body.query);
        var options = JSON.parse(request.body.options);
        var data = JSON.parse(request.body.data);
        mongoUtils.update(colName, query, data, options, function (error, result) {
            if(error)
                return writeToClient(response, result, error, HttpStatus.INTERNAL_SERVER_ERROR);

            writeToClient(response, result);
        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }



});

// Example : http://localhost:8080/database/query/users&{"username":"ihab"}
router.get("/query/:collection&:query", ensureAuthenticated, function (request, response) {
    try {
        debug('query col', request.params.collection);
        debug('query query', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.query(colName, query, function (error, result) {
            debug('query callback result', result);
            if(error)
                return writeToClient(response, result, error, HttpStatus.INTERNAL_SERVER_ERROR);

            writeToClient(response, result);

        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }

});

/**
 * Middleware - Make sure user is logged in
 */
function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated())
        return next();

    return writeToClient(response, null, "Error: User is not logged in", HttpStatus.UNAUTHORIZED);
}

module.exports = router;
