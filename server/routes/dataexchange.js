var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var excel = require('../utils/excel')




router.get('/import', function(request, response) {
    
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


router.get('/export/:collectionName&:query', function(request, response) {

    try 
    {
        var collectionName =  request.params.collectionName;
      //  var query = JSON.parse(request.body.query);
        var query = {};

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
