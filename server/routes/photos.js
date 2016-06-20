var fs = require('fs');
var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var driveUtils = require('../utils/drive');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');
var COLLECTIONS = config.COLLECTIONS;


/**
 * USE CASE - volunteer want to upload profile pic
 * ACL -VOLUNTEER-
 * post for upload profile picture
 * Expected Params:
 * @param file {File} : photo file to be upload
 * @param album {string} : your id (currently we use email as id) its the album
 */
router.post('/profileUpload', middleware.ensureAuthenticated, middleware.ensurePermission, multipartyMiddleware, validation.validateParams, function (req, res) {

    if (req.files.file === undefined || req.files.file === null)
        return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "missing file"});

    driveUtils.uploadFile(
        req.files.file.path,
        req.body.album,
        function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            var photoData = {
                file_id: result.file_id,
                web_link: result.web_link,
                album: req.body.album
            };

            profileSave(
                result.file_id,
                result.web_link,
                req.body.album,
                function (error, result) {
                    if (error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

                    res.send(photoData);
                });
        });
});
/**
 * USE CASE - volunteer want to delete profile pic
 * ACL -VOLUNTEER-
 * Expected Params:
 * @param file_id {string} : file id to by deleted
 */
router.delete('/profileDelete', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

    driveUtils.deleteFile(req.query.file_id, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        profileDelete(req.query.file_id, function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send({success: true});
        })
    });
});
/**
 * USE CASE - volunteer want to view his profile pic or other volunteers profile pic
 * ACL -VOLUNTEER-
 * gets profile pic from db
 * Expected Params:
 * @param album {string} : your id (currently we use email as id) its the album
 */
router.get('/profileGet', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {
    profileGet(req.query.album, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result);
    })
});

/**
 * USE CASE - admin want to upload photos to home page
 * ACL -ADMIN-
 * post for upload photos for home page slider
 * Expected Params:
 * @param file {File} : photo file to be upload
 * @param album {string} : need to be "home" the directive doing it
 */
router.post('/homeUpload', middleware.ensureAuthenticated, middleware.ensurePermission, multipartyMiddleware, validation.validateParams,
    function (req, res) {

    if (req.files.file === undefined || req.files.file === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing file");

    driveUtils.uploadFile(
        req.files.file.path,
        req.body.album,
        function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            var photoData = {
                file_id: result.file_id,
                web_link: result.web_link,
                album: req.body.album
            };

            homeSave(
                result.file_id,
                result.web_link,
                req.body.album,
                function (error, result) {
                    if (error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

                    res.send(photoData);
                });
        });
});
/**
 * USE CASE - admin want to delete photos from home page
 * ACL -ADMIN-
 * delete : for delete photo from home db
 * Expected Params:
 * @param file_id {string} : file id to by deleted
 */
router.delete('/homeDelete', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

    driveUtils.deleteFile(req.query.file_id, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        homeDelete(req.query.file_id, function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send({success: true});
        })
    });
});
/**
 * //USE CASE - GUEST visit the web site and see the photos in the homepage
 * //ACL -GUEST-
 * gets home page photos
 * Expected Params:
 * @param album {string} : home
 */
router.get('/homeGet', validation.validateParams, function (req, res) {
    homeGet(req.query.album, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result);
    })
});

//the router for renovation photos
/**
 * USE CASE -team leader want to upload photos to his renovation
 * ACL -TEAM_LEAD-
 * post for upload photos to to some renovation
 * Expected Params:
 * @param file {File} : photo file to be upload
 * @param album {string} : album (renovation) you want to save the photo to
 */
router.post('/renoUpload', middleware.ensureAuthenticated, middleware.ensurePermission, multipartyMiddleware, validation.validateParams,
    function (req, res) {

    if (req.files.file === undefined || req.files.file === null)
        return res.status(HttpStatus.BAD_REQUEST).send("Error: missing file");

    driveUtils.uploadFile(
        req.files.file.path,
        req.body.album,
        function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            var photoData = {
                file_id: result.file_id,
                web_link: result.web_link,
                album: req.body.album
            };

            renoSave(
                result.file_id,
                result.web_link,
                req.body.album,
                function (error, result) {
                    if (error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

                    res.send(photoData);
                });
        });
});
/**
 * USE CASE -team leader want to delete photos from his renovation
 * ACL -TEAM_LEAD-
 * delete to delete photo from renovation
 * Expected Params:
 * @param file_id {string} : file id to by deleted
 */
router.delete('/renoDelete', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

    driveUtils.deleteFile(req.query.file_id, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        renoDelete(req.query.file_id, function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

            res.send({success: true});
        })
    });
});
/**
 * USE CASE - volunteer want to view photos of his renovation
 * ACL -VOLUNTEER-
 * gets all renovation photos
 * Expected Params:
 * @param album {string} : renovation album
 */
router.get('/renoGet', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {
    renoGet(req.query.album, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);

        res.send(result);
    })
});


//DB METHODS
//TODO maybe need to write 1 func and reuse
/**
 *  save photo data to db
 * @param fileId {String} : photo drive file id
 * @param webContentLink {String} : drive direct link
 * @param album {String} : album of the photo
 * @param callback {Function} : holds err / success
 */
function profileSave(fileId, webContentLink, album, callback) {
    mongoUtils.insert(COLLECTIONS.PROFILE_PIC, {
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
function profileGet(album, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.PROFILE_PIC, {
        album: album
    }, callback);
}
/**
 * delete photo data from the db
 * @param fileId {String} : the drive file id
 * @param callback {Function} : callback holds err / success
 */
function profileDelete(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.PROFILE_PIC, {
        file_id: fileId
    }, callback);
}

/**
 *  save photo data to db
 * @param fileId {String} : photo drive file id
 * @param webContentLink {String} : drive direct link
 * @param album {String} : album of the photo
 * @param callback {Function} : holds err / success
 */
function homeSave(fileId, webContentLink, album, callback) {
    mongoUtils.insert(COLLECTIONS.HOME_PHOTOS, {
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
function homeGet(album, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.HOME_PHOTOS, {
        album: album
    }, callback);
}
/**
 * delete photo data from the db
 * @param fileId {String} : the drive file id
 * @param callback {Function} : callback holds err / success
 */
function homeDelete(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.HOME_PHOTOS, {
        file_id: fileId
    }, callback);
}

/**
 *  save photo data to db
 * @param fileId {String} : photo drive file id
 * @param webContentLink {String} : drive direct link
 * @param album {String} : album of the photo
 * @param callback {Function} : holds err / success
 */
function renoSave(fileId, webContentLink, album, callback) {
    mongoUtils.insert(COLLECTIONS.HOME_PHOTOS, {
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
function renoGet(album, callback) {
    // console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.HOME_PHOTOS, {
        album: album
    }, callback);
}
/**
 * delete photo data from the db
 * @param fileId {String} : the drive file id
 * @param callback {Function} : callback holds err / success
 */
function renoDelete(fileId, callback) {
    mongoUtils.delete(COLLECTIONS.HOME_PHOTOS, {
        file_id: fileId
    }, callback);
}

module.exports = router;