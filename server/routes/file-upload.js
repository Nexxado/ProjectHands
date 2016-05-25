var fs = require('fs');
var router = require('express').Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var writeToClient = require('../utils/writeToClient');
var driveUtils = require('../utils/drive');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;

router.post('/uploads', multipartyMiddleware,
    function (request, response) {
        // We are able to access req.files.file thanks to
        // the multiparty middleware
        var file = request.files.file;
        var albumKey = request.body.album_key;

        console.log('albumKey ' + albumKey);
        console.log(file.name);
        console.log(file.type);

        driveUtils.uploadFile(file.path, albumKey, function (err, res) {
            if (err) {

            } else {
                //saveing the img url in the db
                var webContentLink = res;
                // var albumKey = albumKey;

                saveLink(webContentLink, albumKey, function (err, res) {
                    if (err) {

                    } else {
                        readAlbumImages(albumKey, function (err, res) {
                            writeToClient(response, res);
                            console.log('readAlbumImages ' + res);
                        })
                    }
                });


            }

        });
    });

function saveLink(fileId, album_key, callback) {
    mongoUtils.insert(COLLECTIONS.IMAGES, {album_key: album_key, file_id: fileId}, callback);
}
/**
 *
 * @param albumKey
 * @param callback
 */
function readAlbumImages(albumKey, callback) {
    console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.IMAGES, {album_key: albumKey}, callback);
}
module.exports = router;