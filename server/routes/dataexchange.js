var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var excel = require('../utils/excel')



/*
 * User Login - match user password hash to hash in DB using passport strategy
 */
router.post('/import', function(request, response) {
    
    debug('data importing');

    var fullPath = request.body.filepath;
    excel.importWorkBook(fullPath,function (error,result) {
       if(error )
       {
           return response.redirect(encodeURI('/result/error/'+error));
       }
        return response.redirect(encodeURI('/result/info/' + result));
        
    });

});

/*
 * returns if user is logged in
 */
router.get('/export/:collectionName', function(request, response) {

});


module.exports = router;
