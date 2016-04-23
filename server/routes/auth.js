var router = require('express').Router();
var authUtils = require('../utils/auth');
var debug = require('debug')('routes/auth');
var cookies = require('cookies');
var emailUtils = require('../utils/email');
var config = require('../../config.json');
var serverKey = config.key;
var ROLES = config.ROLES;

function writeToClient(response, data, error) {

    debug('writing to client', data);

    if (!error) {
        response.send(data);
    } else {
        response.status(400).send(data);
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

            debug('login result', result);
            if (result.access !== "Not Allowed") {
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
                cookie.set("access", result.access, options);
                //                emailUtils.confirmationEmail("", credentials.username);
                var data = {
                    access: result.access
                };
                writeToClient(response, data);
                return;
            }

//            debug('cookies', cookies.get('access', {signed: true}));

            writeToClient(response, "Login Error", true);

        });

    } catch (error) {
        writeToClient(response, "Request Error , check input data");
        debug("Login error: ", error);
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
                writeToClient(response, "Error in the sign up process , please try again", true);
            }
        });

    } catch (error) {
        writeToClient(response, "Request Error , check input data", true);
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
        writeToClient(response, "Request Error , check input data");
        debug("The error is : ", error);
    }

});

module.exports = router;
