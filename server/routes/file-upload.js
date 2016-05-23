var fs = require('fs');
var router = require('express').Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var driveUtils = require('../utils/drive');

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
                console.log(res);
            }

        });
    });

module.exports = router;