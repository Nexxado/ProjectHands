var router = require('express').Router();
var mongoUtils = require('../mongoUtils');

/**
 * http://localhost:8080/api/insert/users?data={%22username%22:%22ihab%22,%22age%22:99}
 * */

function writeToClient(response,data,isObject)
{   var value="";
    if(isObject)
    {
        value=JSON.stringify(data);
    }
    else
    {
        value=data;
    }

    response.write(value);
    response.end();
}
router.get("/insert/:col", function (request, response)
    {

        console.log(request.params.col);
        console.log(request.query.data);

        try
        {
            var colName = request.params.col;
            var dataObj = JSON.parse(request.query.data);
            mongoUtils.insert(colName,dataObj,function (result) {
                writeToClient(response,result,true);
            });
        }
        catch (error)
        {
            writeToClient(response,"Request Error",false);
            console.log("The error is : ",error);
        }

    }
);

/**
 * http://localhost:8080/api/delete/users?query={%22username%22:%22test%22}
 * */
router.get("/delete/:col", function (request, response)
    {

        try
        {
            console.log(request.params.col);
            console.log(request.query.query);

            var colName = request.params.col;
            var query = JSON.parse(request.query.query);
            mongoUtils.delete(colName,query,function (result) {
                writeToClient(response,result,true);
            });
        }
        catch (error)
        {
            writeToClient(response,"Request Error",false);
            console.log("The error is : ",error);
        }


    }
);
/**
 * http://localhost:8080/api/update/users?query={%22username%22:%22ihabzz%22}&isUpdateAll=true&data={%22username%22:%22ihabL%22}
 * */
router.get("/update/:col", function (request, response)
    {
        console.log(request.query);
        console.log(request.params.col);
        console.log(request.query.query);
        console.log(request.query.isUpdateAll);
        console.log(request.query.data);
        try
        {
            var colName = request.params.col;
            var query = JSON.parse(request.query.query);
            var isUpdateAll = request.query.isUpdateAll ==="true";
            var data = JSON.parse(request.query.data);
            mongoUtils.update(colName,query,isUpdateAll,data,function (result) {
                writeToClient(response,result,true);

            });
        }
        catch (error)
        {
            writeToClient(response,"Request Error",false);
            console.log("The error is : ",error);
        }



    }
);

/**
 * http://localhost:8080/api/query/users?query={%22username%22=%22ihab%22}
 * */
router.get("/query/:col", function (request, response)
    {

        try
        {
            console.log(request.params.col);
            console.log(request.query.query);

            var colName = request.params.col;
            var query = JSON.parse(request.query.query);
            mongoUtils.query(colName,query,function (result)
            {
                writeToClient(response,result,true);

            });

        }
        catch (error)
        {
            writeToClient(response,"Request Error",false);
            console.log("The error is : ",error);
        }

    }
);

module.exports = router;