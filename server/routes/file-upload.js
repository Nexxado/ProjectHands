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

        console.log('albumKey '+ albumKey);
        console.log(file.name);
        console.log(file.type);
        
        driveUtils.uploadFile(file.path, albumKey);



    });

// function myWriteFile(file, albumKey) {
//
//     console.log('myWriteFile albumKey'+ albumKey);
//
//
//     // console.log(file.size)
//     fs.writeFile(file.name, file, function (err) {
//         if (err) {
//             console.log('File could not be saved.');
//         } else {
//             driveUtils.uploadFile(file.path, albumKey);
//             console.log('uploadFile ' + file.name)
//         }
//     });
//
//
//
//
// }


module.exports = router;