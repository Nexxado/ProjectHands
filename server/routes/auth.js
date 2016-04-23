var router = require('express').Router();
var cookies = require('cookies');
var HttpStatus = require('http-status-codes');
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var emailUtils = require('../utils/email');
var config = require('../../config.json');
var serverKey = config.key;
var ROLES = config.ROLES;

function writeToClient(response, data, status) {

    var isError = JSON.stringify(data).match(/error/i) !== null;
    debug('writing to client', data);
    debug('is data error?', isError);

    if (isError) {
        if(!status)
            status = HttpStatus.BAD_REQUEST;
        response.status(status).send(data);
        return;
    }

    if(typeof data === 'object')
        response.json(data);
    else
        response.send(data);
}

// Example : http://localhost:8080/database/query/{"username":"ihabzh" ,"time": "12:01" , "random": "66"}&key":%20"66"%7D&a196c048361fb127a4a1f6d1f95afd0254b7d700cef7b3df49727c78f1853a4f1fb8964e3fc52cc6503f8379d29f842a0101188e4ea80227a06ded9952fd5fa9
router.post("/login", function (request, response) {
    try {
        var credentials = JSON.parse(request.body.credentials);
        var key = request.body.hash;

        //Var cookie = request.cookie;

        //we get the user password from the DB
        authUtils.login(credentials, key, function (result) {

            debug('login result', result);
            if (result.user !== "Not Allowed") {
                var cookie = new cookies(request, response, {
                    keys: [serverKey]
                });
                //var cookie = co.get("token");

                var token = result.token.substring(3, 70);
                var age = (3600 * 1000); //hour in milliseconds
                var options = {
                    signed: true
                };
                if(!credentials.remember) {
                    debug('remember = false');
                    options.maxAge = age;
                }

                cookie.set("token", token, options);
                cookie.set("access", result.user.role, options);
                //                emailUtils.confirmationEmail("", credentials.username);

                writeToClient(response, result.user);
                return;
            }

//            debug('cookies', cookies.get('access', {signed: true}));

            writeToClient(response, "Error: Login Failed", HttpStatus.UNAUTHORIZED);

        });

    } catch (error) {
        writeToClient(response, "Error: Login Request Failed, check input data");
        debug("Login error:", error);
    }

});


router.post("/signup", function (request, response) {
    try {
        var user = JSON.parse(request.body.user);
        user.role = ROLES.GUEST;

        authUtils.signUp(user, function (result) {

            debug('signup result', result);
            if (result) { // user data inserted successfully
                //                emailUtils.confirmationEmail(credentials.email, credentials.name); //FIXME send confirmation email on signup
                writeToClient(response, result);

            } else {
                writeToClient(response, "Error: Sign-Up Failed, please try again", HttpStatus.BAD_REQUEST);
            }
        });

    } catch (error) {
        writeToClient(response, "Error: Sign-Up Request Failed", HttpStatus.BAD_REQUEST);
        debug("SignUp error: ", error);
    }

});

router.get('/access', function (request, response) {
    try {

    } catch (error) {

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
        writeToClient(response, "Error: Roles Request Failed, check input data", HttpStatus.BAD_REQUEST);
        debug("Roles error:", error);
    }

});

module.exports = router;
