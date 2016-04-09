var router = require('express').Router();
var mongoUtils = require('../mongoUtils');

/**
 * http://localhost:8080/api/insert/users?data={%22username%22:%22ihab%22,%22age%22:99}
 * */
router.get("/insert/:col", function (request, response)
    {

        console.log(request.params.col);
        console.log(request.query.data);

        var colName = request.params.col;
        var dataObj = JSON.parse(request.query.data);
        mongoUtils.insert(colName,dataObj);
        response.write("done");
        response.end();

    }
);

/**
 * http://localhost:8080/api/delete/users?query={%22username%22:%22test%22}
 * */
router.get("/delete/:col", function (request, response)
    {

        console.log(request.params.col);
        console.log(request.query.query);

        var colName = request.params.col;
        var query = JSON.parse(request.query.query);
        mongoUtils.delete(colName,query);
        response.write("done");
        response.end();

    }
);
/**
 * http://localhost:8080/api/update/users?query={%22username%22:%22ihabzz%22}&isUpdateAll=true&data={%22username%22:%22ihabL%22}
 * */
router.get("/update/:col", function (request, response)
    {

        console.log(request.params.col);
        console.log(request.query.query);
        console.log(request.query.isUpdateAll);
        console.log(request.query.data);

        var colName = request.params.col;
        var query = JSON.parse(request.query.query);
        var isUpdateAll = request.query.isUpdateAll ==="true";
        var data = JSON.parse(request.query.data);
        mongoUtils.update(colName,query,isUpdateAll,data);
        /*
         var colName = request.params.col;
         var query = JSON.parse(request.query.query);
         mongoUtils.delete(colName,query);*/
        response.write("done");
        response.end();

    }
);


module.exports = router;