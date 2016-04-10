var router = require('express').Router();
var mongoUtils = require('../mongoUtils');
var debug = require('debug')('routes/database');


function writeToClient(response, data, isObject) {
    
    debug('writetoclient data', data);
    debug('writetoclient isObject', isObject);
    
    if (data !== null) {
        if (isObject) {
            response.json(data);
            return;
        } else {
            response.send(data);
            return;
        }

    } else {
        response.send("DB Error");
    }

}
router.post("/insert", function (request, response) {

    debug('insert col', request.body.collection);
    debug('insert data', request.body.data);

    try {
        var colName = request.body.collection;
        var dataObj = JSON.parse(request.body.data);
        mongoUtils.insert(colName, dataObj, function (result) {
            writeToClient(response, result, true);
        });
    } catch (error) {
        writeToClient(response, "Request Error", false);
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
            writeToClient(response, result, true);
        });
    } catch (error) {
        writeToClient(response, "Request Error", false);
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
            writeToClient(response, result, true);

        });
    } catch (error) {
        writeToClient(response, "Request Error", false);
        debug("The error is : ", error);
    }



});


router.get("/query/:collection&:query", function (request, response) {

    try {
        debug('query col', request.params.collection);
        debug('query query', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.query(colName, query, function (result) {
            debug('query callback result', result);
            writeToClient(response, result, true);

        });

    } catch (error) {
        writeToClient(response, "Request Error", false);
        debug("The error is : ", error);
    }

});

module.exports = router;
