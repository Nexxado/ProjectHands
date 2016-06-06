var fs = require('fs');
var router = require('express').Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var driveUtils = require('../utils/drive');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var HttpStatus = require('http-status-codes');

//the router for photos module
/**
 * post for upload photos to sever using multipartyMiddleware
 * Expected Params:
 * @param file {File} : photo file to be upload
 * @param album {string} : album you want to save the photo to
 */
router.post('/uploads', multipartyMiddleware, function (req, res) {

    if (req.body.album === undefined || req.body.album === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing album");

    if (req.files.file === undefined || req.files.file === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing file");

    driveUtils.uploadFile(
        req.files.file.path,
        req.body.album,
        function (error, result) {
            if (error || !result)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            var photoData = {
                file_id: result.file_id,
                web_link: result.web_link,
                album: req.body.album
            };

            savePhoto(result.file_id,
                result.web_link,
                req.body.album,
                function (error, result) {
                    if (error || !result)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

                    res.send(photoData);
                });
        });
});
/**
 * post for delete photo from drive and db
 * Expected Params:
 * @param file_id {string} : file id to by deleted
 */
router.delete('/delete', function (req, res) {

    if (req.query.file_id === undefined || req.query.file_id === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Missing file id");

    driveUtils.deleteFile(req.query.file_id, function (error, result) {
        if (error || !result)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        deletePhoto(req.query.file_id, function (error, result) {
            if (error || !result)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send({success: true});
        })
    });
});

/**
 * gets album data from the db
 * Expected Params:
 * @param album {string} : album to by deleted
 */
router.get('/album', function (req, res) {
    getAlbum(req.query.album, function (error, result) {
        if (error || !result)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result);
    })
});


//DB METHODS
/**
 *  save photo data to db
 * @param fileId {String} : photo drive file id
 * @param webContentLink {String} : drive direct link
 * @param album {String} : album of the photo
 * @param callback {Function} : holds err / success
 */
function savePhoto(fileId, webContentLink, album, callback) {
    mongoUtils.insert(COLLECTIONS.PHOTOS, {
            album: album,
            web_link: webContentLink,
            file_id: fileId
        }
        , callback);
}
/**
 *  get all photos of particular album
 * @param album {String} : the album
 * @param callback {Function} : callback holds err / success
 */
function getAlbum(album, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.PHOTOS, {
        album: album
    }, callback);
}
/**
 * delete photo data from the db
 * @param fileId {String} : the drive file id
 * @param callback {Function} : callback holds err / success
 */
function deletePhoto(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.PHOTOS, {
        file_id: fileId
    }, callback);
}
module.exports = router;