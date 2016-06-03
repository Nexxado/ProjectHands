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
    var albumKey = req.body.album_key;

    //check if its no album key
    if (!albumKey)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: missing album_key"});

    if (!file)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Error: missing file"});

    //upload photo to google drive
    driveUtils.uploadFile(
        file.path,
        albumKey,
        function (error, resolt) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not saved"});

            var photoData = {
                file_id: resolt.file_id,
                web_link: resolt.web_link,
                album_key: albumKey
            };
            //save photo data to server db
            savePhoto(res.file_id, res.web_link, albumKey, function (error, resolt) {
                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error: file not saved"});

                //send to client new photo data
                res.send(photoData);
            });
        });
});
/**
 * post for delete photo from drive and db
 * TODO change to delete method
 */
router.post('/delete', function (request, response) {

    var fileId = request.body.file_id;

    //delete file from drive 
    driveUtils.deleteFile(fileId, function (err, res) {
        if (err) {
            writeToClient(response, null, "Error: file did not deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            //delete photo data from the db
            deletePhoto(fileId, function (err, res) {
                if (err) {
                    writeToClient(response, null, "Error: file did not deleted", HttpStatus.INTERNAL_SERVER_ERROR);
                } else {
                    writeToClient(response);
                }
            })

        }
    });
});
/**
 * gets album data from the db
 */
router.get('/album', function (request, response) {
    var album = request.query.album;
    getAlbum(album, function (err, res) {
        if (err) {
            writeToClient(response, null, "Error: INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            writeToClient(response, res);
        }
    })
});


//DB METHODS
/**
 *  save photo data to db
 * @param fileId : photo drive file id
 * @param webContentLink : drive direct link
 * @param album_key : album of the photo
 * @param callback : holds err / success
 */
function savePhoto(fileId, webContentLink, album_key, callback) {
    mongoUtils.insert(COLLECTIONS.PHOTOS, {
            album_key: album_key,
            web_link: webContentLink,
            file_id: fileId
        }
        , callback);
}
/**
 *  get all photos of particular album
 * @param albumKey : the album
 * @param callback : callback holds err / success
 */
function getAlbum(albumKey, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.PHOTOS, {
        album_key: albumKey
    }, callback);
}
/**
 * delete photo data from the db
 * @param fileId : the drive file id
 * @param callback : callback holds err / success
 */
function deletePhoto(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.PHOTOS, {
        file_id: fileId
    }, callback);
}
module.exports = router;