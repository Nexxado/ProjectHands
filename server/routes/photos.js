var fs = require('fs');
var router = require('express').Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var writeToClient = require('../utils/writeToClient');
var driveUtils = require('../utils/drive');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var HttpStatus = require('http-status-codes');

//the router for photos module
/**
 * post for upload photos to sever using multipartyMiddleware
 *
 */
router.post('/uploads', multipartyMiddleware, function (req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;
    var album = req.body.album;

    if (!album)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: missing album"});

    if (!file)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: missing file"});

    //upload photo to google drive
    driveUtils.uploadFile(
        file.path,
        album,
        function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not saved"});

            var photoData = {
                file_id: result.file_id,
                web_link: result.web_link,
                album: album
            };
            //save photo data to server db
            savePhoto(photoData.file_id,
                photoData.web_link,
                photoData.album,
                function (error, result) {
                    if (error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not saved"});

                    //send to client new photo data
                    res.send(photoData);
                });
        });
});
/**
 * post for delete photo from drive and db
 *
 */
router.delete('/delete', function (req, res) {

    var fileId = req.query.file_id;

    //delete file from drive 
    driveUtils.deleteFile(fileId, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not deleted"});

        //delete photo data from the db
        deletePhoto(fileId, function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not deleted"});

            res.send({success: true});
        })
    });
});
/**
 * gets album data from the db
 */
router.get('/album', function (req, res) {
    var album = req.query.album;
    getAlbum(album, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Couldn't find album"})

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