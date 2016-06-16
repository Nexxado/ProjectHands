var router = require('express').Router();
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var HttpStatus = require('http-status-codes');
var ObjectId = require('mongodb').ObjectID;

/**
 * //USE CASE - admin want to upload ad to home page
 * //ACL -ADMIN-
 * post for upload ad to sever
 * Expected Params:
 * @param title {string} : title
 * @param content {string} : content
 */
router.post('/upload', function (req, res) {

    if (req.body.title === undefined || req.body.title === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing title");

    if (req.body.content === undefined || req.body.content === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing content");

    saveAd(
        req.body.title,
        req.body.content,
        function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send(result);
        });
});

/**
 * //USE CASE - admin want to  delete ad from home page
 * //ACL -ADMIN-
 * for delete ad from db
 * Expected Params:
 * @param id {string} : ad id to by deleted
 */
router.delete('/delete', function (req, res) {

    if (req.query.id === undefined || req.query.id === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Missing id");

    deleteAd(req.query.id, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send({success: true});
    })
});

/**
 * //USE CASE - GUEST visit the web site and see ads
 * //ACL -GUEST-
 */
router.get('/ads', function (req, res) {
    getAds(function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result);
    })
});

//DB METHODS
/**
 * @param callback {Function} : holds err / success
 */
function saveAd(title, content, callback) {
    mongoUtils.insert(COLLECTIONS.ADS, {
            title: title,
            content: content
        }
        , callback);
}
/**
 * @param callback {Function} : callback holds err / success
 */
function getAds(callback) {
    mongoUtils.query(COLLECTIONS.ADS, {}, callback);
}
/**
 *
 */
function deleteAd(id, callback) {
    mongoUtils.delete(COLLECTIONS.ADS, {
        _id: new ObjectId(id)
    }, callback);
}
module.exports = router;