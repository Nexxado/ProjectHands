var router = require('express').Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var fs = require('fs');
router.post('/uploads', multipartyMiddleware,
    function (request, response) {
        // We are able to access req.files.file thanks to
        // the multiparty middleware
        var file = request.files.file;
        console.log(file.name);
        console.log(file.type);
        myWriteFile(file);

    });

function myWriteFile(file) {
    fs.writeFile(file.name, file.buffer, function (err) {
        if (err) {
            console.log('File could not be saved.');
        } else {
            console.log('uploadFile ' + file.name)
            // uploadFile(myAuth, file.name);
            console.log(file.name + ' saved to local machine.');
        }
        ;
    });
}
module.exports = router;