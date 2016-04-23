var router = require('express').Router();
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var cookies = require('cookies');
var emailUtils = require('../utils/email');
var serverKey = require('../../config.json').key;

function writeToClient(response, data) {
    
    debug('writing to client', data);
    
    if (data) {
        response.send(data);
    } else {
        response.status(400).send("login Error");
    }
}

// Example : http://localhost:8080/database/query/{"username":"ihabzh" ,"time": "12:01" , "random": "66"}&key":%20"66"%7D&a196c048361fb127a4a1f6d1f95afd0254b7d700cef7b3df49727c78f1853a4f1fb8964e3fc52cc6503f8379d29f842a0101188e4ea80227a06ded9952fd5fa9
router.get("/login/:credentials&:hash", function (request, response) {
    try {
        var credentials = JSON.parse(request.params.credentials);
        var key = request.params.hash;

        //Var cookie = request.cookie;

        //we get the user password from the DB
        authUtils.login(credentials, key, function (result) {
            
            var data = undefined;
            debug('result', result);
            if (result.access !== "Not Allowed") {
                var cookie = new cookies(request, response, {
                    keys: [serverKey]
                });
                //var cookie = co.get("token");

                var token = result.token.substring(3, 70);
                cookie.set("token", token, {
                    signed: true,
                    maxAge: 3600
                });
                cookie.set("access", result.access, {
                    signed: true,
                    maxAge: 3600
                });
//                emailUtils.confirmationEmail("", credentials.username);
                data = {access: result.access};
            
            } 

            writeToClient(response, data);

        });

    } catch (error) {
        writeToClient(response, "Request Error , check input data");
        debug("The error is : ", error);
    }

});


router.get("/signup/:credentials", function (request, response) {
    try {
        var credentials = JSON.parse(request.params.credentials);

        authUtils.signUp(credentials, function (result) {

            if (result) // user data inserted successfully
            {
                emailUtils.confirmationEmail(credentials.email, credentials.username);
                writeToClient(response, result);

            } else {
                writeToClient(response, "Error has accord in the sign up process , please try again");

            }


        });

    } catch (error) {
        writeToClient(response, "Request Error , check input data");
        debug("The error is : ", error);
    }

});

router.get("/roles/:exec&:target&:role", function (request, response) {
    try {
        var role = request.params.role;
        var executerUsername = request.params.exec;
        var targetUsername = request.params.target;


        authUtils.setUserRole(role, executerUsername, targetUsername, function (result) {
            var message = "Cant change the role.";

            if (result) {
                message = result.toString();
            }

            writeToClient(response, message);



        });

    } catch (error) {
        writeToClient(response, "Request Error , check input data");
        debug("The error is : ", error);
    }

});

module.exports = router;
