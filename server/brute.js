/**
 * Created by ND88 on 13/06/2016.
 */
var ExpressBrute = require('express-brute');
var MongoBruteStore = require('express-brute-mongo');
var HttpStatus = require('http-status-codes');
var moment = require('moment');
var debug = require('debug')('brute');
var config = require('../config.json');
var COLLECTIONS = config.COLLECTIONS;

var MongoClient = require('mongodb').MongoClient;
var DB_URL = process.env.MONGODB_URL || config.mongoDBUrl;
var brute = {};

/********************************************/
/***** Express-Brute callback functions *****/
/********************************************/
function failCallback(req, res, next, nextValidRequestDate) {
    return res.status(HttpStatus.BAD_REQUEST)
        .send({errMessage: "Reached maximum attempts", nextValidRequestDate: nextValidRequestDate});
}

function handleStoreError(error) {
    log.error(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
}

/**
 * express-brute init function
 * @returns {object}
 */
module.exports = function() {

    debug('Initializing express-brute');
    var bruteStore = new MongoBruteStore(function(ready) {
        // ready(mongoUtil.getCollection(COLLECTIONS.BRUTE));

        MongoClient.connect(DB_URL, function(err, db) {
            if (err) throw err;
            ready(db.collection(COLLECTIONS.BRUTE));
        });
    });


    // Start slowing requests after 5 failed attempts to do something for the same user
    // This will track requests per route
    brute.local = new ExpressBrute(bruteStore, {
        freeRetries: 5,
        proxyDepth: 1,
        minWait: 5 * 60 * 1000, // 5 minutes
        maxWait: 60 * 60 * 1000, // 1 hour,
        failCallback: failCallback,
        handleStoreError: handleStoreError
    });
    // No more than 20 email-change per day per IP
    // This will track requests across all routes that use express-brute
    brute.global = new ExpressBrute(bruteStore, {
        freeRetries: 40,
        proxyDepth: 1,
        attachResetToRequest: false,
        refreshTimeoutOnRequest: false,
        minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
        maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
        lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
        failCallback: failCallback,
        handleStoreError: handleStoreError
    });

    return brute;
};
