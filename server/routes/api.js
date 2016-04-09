var router = require('express').Router();
var mongoUtils = require('../mongoUtils');

// to be added
router.get("/insert", function (request, response)
    {

       // var  res = mongoUtils.insert("users",{username : "test",age:19})
          //  mongoUtils.update("users",{username : "test"},{username : "test1"},true);
       // mongoUtils.delete("users",{username :"test"},true);
        //response.write("done " );
        //response.end();

        /*
                console.log("before Data inserted");
                mongoUtils.getCollection("users").insert({username : "ihabzz",age:19},{w:1}, function(err, result) {
                    console.log(err);
                });
                console.log("Data inserted");*/
    }
);


module.exports = router;