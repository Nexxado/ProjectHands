var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var mongoUtils = require('../utils/mongo');
var debug = require('debug')('routes/database');


/**
 * Convenience Routes - FOR DEVELOPMENT PURPOSES ONLY!!!
 * TODO This file will be deleted in production
 */


router.post("/insert", function (req, res) {

    debug('insert col', req.body.collection);
    debug('insert data', req.body.data);

    try {
        var colName = req.body.collection;
        var dataObj = JSON.parse(req.body.data);
        mongoUtils.insert(colName, dataObj, function (error, result) {
            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send(result);
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Request Error"});
        debug("The error is : ", error);
    }

});

/**
 * http://localhost:8080/api/delete/users?query={%22username%22:%22test%22}
 * */
router.delete("/delete/:collection&:query", function (req, res) {
    try {
        debug('delete col', req.params.collection);
        debug('delete data', req.params.query);

        var colName = req.params.collection;
        var query = JSON.parse(req.params.query);
        mongoUtils.delete(colName, query, function (error, result) {
            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send(result);
        });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Request Error"});
        debug("The error is : ", error);
    }


});


router.post("/update", function (req, res) {
    debug(req.body.collection);
    debug(req.body.query);
    debug(req.body.data);
    debug(req.body.options);

    try {
        var colName = req.body.collection;
        var query = JSON.parse(req.body.query);
        var options = JSON.parse(req.body.options);
        var data = JSON.parse(req.body.data);
        mongoUtils.update(colName, query, data, options, function (error, result) {
            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send(result);
        });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Request Error"});
        debug("The error is : ", error);
    }



});

// Example : http://localhost:8080/database/query/users&{"username":"ihab"}
router.get("/query/:collection&:query", function (req, res) {
    try {
        debug('query col', req.params.collection);
        debug('query query', req.params.query);

        var colName = req.params.collection;
        var query = JSON.parse(req.params.query);
        mongoUtils.query(colName, query, function (error, result) {
            debug('query callback result', result);
            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send(result);

        });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Request Error"});
        debug("The error is : ", error);
    }

});

module.exports = router;
