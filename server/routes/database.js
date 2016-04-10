var router = require('express').Router();
var mongoUtils = require('../mongoUtils');


function writeToClient(response, data, isObject) {
    var value = "";
    if (data !== null) {
        if (isObject) {
            value = JSON.stringify(data);
        } else {
            value = data;
        }

    } else {
        value = "DB Error";
    }
    response.write(value);
    response.end();

}
router.post("/insert", function (request, response) {

    console.log('insert col', request.body.collection);
    console.log('insert data', request.body.data);

    try {
        var colName = request.body.collection;
        var dataObj = JSON.parse(request.body.data);
        mongoUtils.insert(colName, dataObj, function (result) {
            writeToClient(response, result, true);
        });
    } catch (error) {
        writeToClient(response, "Request Error", false);
        console.log("The error is : ", error);
    }

});

/**
 * http://localhost:8080/api/delete/users?query={%22username%22:%22test%22}
 * */
router.delete("/delete/:collection&:query", function (request, response) {

    try {
        console.log('delete col', request.params.collection);
        console.log('delete data', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.delete(colName, query, function (result) {
            writeToClient(response, result, true);
        });
    } catch (error) {
        writeToClient(response, "Request Error", false);
        console.log("The error is : ", error);
    }


});


router.post("/update", function (request, response) {
    console.log(request.body.collection);
    console.log(request.body.query);
    console.log(request.body.data);
    console.log(request.body.options);

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
        console.log("The error is : ", error);
    }



});


router.get("/query/:collection&:query", function (request, response) {

    try {
        console.log('query col', request.params.collection);
        console.log('query query', request.params.query);

        var colName = request.params.collection;
        var query = JSON.parse(request.params.query);
        mongoUtils.query(colName, query, function (result) {
            writeToClient(response, result, true);

        });

    } catch (error) {
        writeToClient(response, "Request Error", false);
        console.log("The error is : ", error);
    }

});

module.exports = router;
