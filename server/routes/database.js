var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var mongoUtils = require('../utils/mongo');
var debug = require('debug')('routes/database');


function writeToClient(response, data, status) {
    
    var isError = JSON.stringify(data).match(/error/i) !== null;
    debug('writetoclient data', data);
    debug('is data error?', isError);
    
    if(isError) {
        response.status(status).send("DB Error");
        return;
    }

    if(typeof data === 'object')
        response.json(data);
    else
        response.send(data);
}

router.post("/insert", function (request, response) {

    debug('insert col', request.body.collection);
    debug('insert data', request.body.data);

    try {
        var colName = request.body.collection;
        var dataObj = JSON.parse(request.body.data);
        mongoUtils.insert(colName, dataObj, function (result) {
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
router.delete("/delete/:collection&:query", function (request, response) {
    try {
        debug('delete col', request.params.collection);
        debug('delete data', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.delete(colName, query, function (result) {
            writeToClient(response, result);
        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }


});


router.post("/update", function (request, response) {
    debug(request.body.collection);
    debug(request.body.query);
    debug(request.body.data);
    debug(request.body.options);

    try {
        var colName = request.body.collection;
        var query = JSON.parse(request.body.query);
        var options = JSON.parse(request.body.options);
        var data = JSON.parse(request.body.data);
        mongoUtils.update(colName, query, data, options, function (result) {
            writeToClient(response, result);

        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }



});

// Example : http://localhost:8080/database/query/users&{"username":"ihab"}
router.get("/query/:collection&:query", function (request, response) {
    try {
        debug('query col', request.params.collection);
        debug('query query', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.query(colName, query, function (result) {
            debug('query callback result', result);
            writeToClient(response, result);

        });

    } catch (error) {
        writeToClient(response, "Request Error", HttpStatus.INTERNAL_SERVER_ERROR);
        debug("The error is : ", error);
    }

});

module.exports = router;
