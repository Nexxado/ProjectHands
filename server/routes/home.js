var router = require('express').Router();
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var HttpStatus = require('http-status-codes');
var ObjectId = require('mongodb').ObjectID;
/**
 * post for upload photos to sever using multipartyMiddleware
 * Expected Params:
 * @param file {File} : photo file to be upload
 * @param album {string} : album you want to save the photo to
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
 * post for delete photo from drive and db
 * Expected Params:
 * @param file_id {string} : file id to by deleted
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
 * @param album {string} : album to by deleted
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
 * delete photo data from the db
 * @param fileId {String} : the drive file id
 * @param callback {Function} : callback holds err / success
 */
function deleteAd(id, callback) {
    mongoUtils.delete(COLLECTIONS.ADS, {
        _id: new ObjectId(id)
    }, callback);
}
module.exports = router;