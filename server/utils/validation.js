
var debug = require('debug')('utils/validation');
var HttpStatus = require('http-status-codes');

var validation = {};

/**
 * Validate phone number
 * @param phone {String}
 * @returns {boolean}
 */
function validatePhone(phone) {
    var regexPhone = /^0(5(2|3|4|7|8)|(2|3|4|8)|77)-?\d{4}-?\d{3}$/;
    return regexPhone.test(phone);
}

/**
 * Validate Email
 * @param email {String}
 * @returns {boolean}
 */
function validateEmail(email) {
    //Email Regex according to RFC 5322. - http://emailregex.com/
    var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return regexEmail.test(email);
}

/**
 * Validate Password
 * @param password {String}
 * @returns {boolean}
 */
function validatePassword(password) {
    var constraints = [/[A-Z]/, /[a-z]/, /[0-9]/, /^.{8,}$/];
    var counter = 0;
    for(var i = 0; i < constraints.length; i++) {
        if(constraints[i].test(password))
            counter++;
    }
    return counter === constraints.length;
}

/**
 * Validate user sign-up details
 * @param user {Object}
 * @returns {boolean}
 */
function validateSignup(user) {
    if (!user ||
        !user.email || user.email === '' ||
        !user.password || user.password === '' ||
        !user.name || user.name === '' ||
        !user.phone || user.phone === '')
        return false;

    if(!user.area || !user.area.length || (user.team_leader && user.team_leader.length > 1))
        return false;

    return validateEmail(user.email) && validatePassword(user.password) && validatePhone(user.phone);
}


/**
 * Validate user info on OAuth sign-up
 * @param info {Object}
 * @returns {boolean}
 */
function validateOauthSignup(info) {
    if (!info ||
        !info.phone || info.phone === '')
        return false;

    if(!info.area || !info.area.length || (info.team_leader && info.team_leader.length > 1))
        return false;

    return validatePhone(info.phone);
}

/**
 * Validate Array of emails
 * @param members {Array} : array of emails
 * @returns {boolean}
 */
function validateMembers(members) {

    if(typeof members !== 'object' || !Array.isArray(members))
        return false;

    for(var i = 0; i < members.length; i++) {
        if(!validateEmail(members[i]))
            return false;
    }

    return true;
}

//Middleware to validate request params according to request path
validation.validateParams = function(req, res, next) {
    debug('validateParams path', req.path);

    switch(true) {
        case /auth\/signup/.test(req.originalUrl):
            if(!req.body.user || !validateSignup(JSON.parse(req.body.user)))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Please Provide all required fields"});
            break;

        case /auth\/signup_oauth/.test(req.originalUrl):
            if(typeof req.user.signup_complete === 'undefined' || req.user.signup_complete === true)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Sign-Up Process has already been completed"});
            else if(!req.body.info || !validateOauthSignup(JSON.parse(req.body.info)))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Please Provide all required fields"});
            break;

        case /auth\/login/.test(req.originalUrl):
            if(!req.body.email || !req.body.password ||
                !validateEmail(req.body.email) || !validatePassword(req.body.password))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Email or Password are incorrect"});
            break;

        case /auth\/forgot/.test(req.originalUrl):
            if(req.isAuthenticated() && (req.user.googleId || req.user.facebookId))
                return res.status(HttpStatus.FORBIDDEN).send({errMessage: "User is signed in via OAuth2 provider"});

            if(!req.body.email || !req.body.new_password || !req.body.old_password ||
                !validatePassword(req.body.new_password) || !validatePassword(req.body.old_password))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Old or New Password is incorrect"});
            break;
        
        case /status\/update_status/.test(req.originalUrl):
            if(typeof req.body.active !== 'boolean')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid new status"});
            if(!req.body.message)
                req.body.mesage = '';
            break;

        case /renovation\/get_info/.test(req.originalUrl):
        case /renovation\/create/.test(req.originalUrl):
        case /renovation\/rsvp/.test(req.originalUrl):
            if(!req.body.city || !req.body.street || !req.body.num)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address"});
            break;

        case /renovation\/edit/.test(req.originalUrl):
            if(false) //TODO Add params to check
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Please provide all required fields"});
            break;

        case /user\/approve/.test(req.originalUrl):
            if(!req.body.email || !req.body.role)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid user email or role"});
            break;

        case /user\/user_info/.test(req.originalUrl):
        case /user\/delete/.test(req.originalUrl):
            if(!req.params.email)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid user email"});
            break;

        case /user\/assign_role/.test(req.originalUrl):
            if(!req.body.email || !req.body.newRole)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: 'No user or new role provided'});
            break;

        case /team\/create/.test(req.originalUrl):
            if(!req.body.name)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name"});
            break;

        case /team\/delete/.test(req.originalUrl):
            if(!req.params.name)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name"});
            break;

        case /team\/add_members/.test(req.originalUrl):
        case /team\/remove_members/.test(req.originalUrl):
            if(!req.body.name || !req.body.members || !validateMembers(req.body.members))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or members emails"});
            break;

        case /team\/assign_to_renovation/.test(req.originalUrl):
            if(!req.body.name || !req.body.city || !req.body.street || !req.body.num)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or renovation address"});
            break;

        default:
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "No Validation Performed"});
    }
    return next();
};


module.exports = validation;