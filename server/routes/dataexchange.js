var router = require('express').Router();
var excel = require('../utils/excel');
var middleware = require('../utils/middleware');




router.post('/import', middleware.ensureAuthenticated, middleware.ensurePermission, function(request, response) {

    //TODO: get the real path on the server
    debug('data importing');
    //var fullPath = request.body.filepath;
    var fullPath = "table.xlsx";

    excel.importWorkBook(fullPath,function (error,result) {
       if(error )
       {
           return response.redirect(encodeURI('/result/error/'+error));
       }
        return response.redirect(encodeURI('/result/info/' + result));
        
    });

});


router.get('/export/:collectionName&:query', middleware.ensureAuthenticated, middleware.ensurePermission, function(request, response) {

    try 
    {
        var collectionName =  request.params.collectionName;
       var query = JSON.parse(request.params.query);

        excel.exportCollection(collectionName,query,response,function (error,result) {
            if(error)
            {
                return response.redirect(encodeURI('/result/error/'+error));
            }

        });
    }

    catch (e)
    {
        return response.redirect(encodeURI('/result/error/'+e));

    }


});


module.exports = router;
