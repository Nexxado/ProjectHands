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
                console.log('uploadFile ' + res);

                // saveLink(fileId, webContentLink, album_key, callback)
                saveLink(res.file_id, res.web_link, albumKey, function (err, res) {
                    if (err) {

                    } else {
                        getAlbum(albumKey, function (err, res) {
                            writeToClient(response, res);
                            console.log('getAlbum ' + res);
                        })
                    }
                });


            }

        });
    });

router.post('/delete', function (request, response) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    // var photoUrl = request.body.photo_url;

    var fileId = request.body.file_id;
    console.log('fileId for delete : ' + fileId);
    driveUtils.deleteFile(fileId, function (err, res) {
        if(err){
            console.log('deleteFile : ' + err);
        }else {
            deletePhoto(fileId, function (err, res) {
                if(err){
                    console.log('deletePhoto err : ' + err);
                }else{
                    console.log('deletePhoto res : ' + res);
                    writeToClient(response);
                }
            })
            console.log('deleteFile : ' + res);
        }
    });
});

router.get('/album', function (request, response) {
    var album = request.query.album;
    console.log('album : ' + album);

    getAlbum(album, function (err, res) {
        if(err){

        }else {
            writeToClient(response, res);
        }
    })
});

function saveLink(fileId, webContentLink, album_key, callback) {
    mongoUtils.insert(COLLECTIONS.IMAGES, {album_key: album_key, web_link: webContentLink, file_id: fileId}, callback);
}
/**
 *
 * @param albumKey
 * @param callback
 */
function getAlbum(albumKey, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.IMAGES, {album_key: albumKey}, callback);
}
function deletePhoto(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.IMAGES, {file_id: fileId}, callback);
}
module.exports = router;