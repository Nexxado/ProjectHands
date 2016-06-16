var debug = require('debug')('utils/validation');
var HttpStatus = require('http-status-codes');
var config = require('../../config.json');
var ROLES = config.ROLES;
var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) {
    return ROLES[key];
}); //.reverse();

var validation = {};

/**
 * Validate phone number
 * @param phone {String}
 * @returns {boolean}
 */
function validatePhone(phone) {
    if(!validateString(phone))
        return false;

    var regexPhone = /^0(5(2|3|4|7|8)|(2|3|4|8)|77)-?\d{4}-?\d{3}$/;
    return regexPhone.test(phone);
}

/**
 * Validate Email
 * @param email {String}
 * @returns {boolean}
 */
function validateEmail(email) {
    if(!validateString(email))
        return false;

    //Email Regex according to RFC 5322. - http://emailregex.com/
    var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    email = email.toLowerCase();
    return regexEmail.test(email);
}

/**
 * Validate Password
 * @param password {String}
 * @returns {boolean}
 */
function validatePassword(password) {
    if(!validateString(password))
        return false;

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

    if (!user)
        return false;

    try {
        user = JSON.parse(user)
    } catch (error) {
        debug('validateSignup JSON.parse error', error);
        return false;
    }

    if(!Array.isArray(user.area) || !user.area.length 
        || !Array.isArray(user.team_leader) || user.team_leader.length > 1 
        || !Array.isArray(user.preferred_day)
        || typeof user.remarks !== 'string'
        || typeof user.extra !== 'string')
        return false;

    return validateEmail(user.email) && validatePassword(user.password) && validatePhone(user.phone) && validateString(user.name);
}


/**
 * Validate user info on OAuth sign-up
 * @param info {Object}
 * @returns {boolean}
 */
function validateOauthSignup(info) {

    if (!info)
        return false;

    try {
        info = JSON.parse(info);
    } catch(error) {
        debug('validateOauthSignup JSON.parse error', error);
        return false;
    }

    if(!Array.isArray(info.area) || !info.area.length
        || !Array.isArray(info.team_leader) || info.team_leader.length > 1
        || !Array.isArray(info.preferred_day)
        || typeof info.remarks !== 'string'
        || typeof info.extra !== 'string')
        return false;

    return validatePhone(info.phone);
}

/**
 * Validate Array of emails
 * @param members {Array} : array of emails
 * @returns {boolean}
 */
function validateMembers(members) {
    
    // members = JSON.parse(members);

    if(!Array.isArray(members) || !members.length)
        return false;

    for(var i = 0; i < members.length; i++) {
        if(!validateEmail(members[i]))
            return false;
    }

    return true;
}

/**
 * Validate if user role is a valid role
 * @param role {String}
 * @returns {boolean}
 */
function validateRole(role) {
    if(!validateString(role))
        return false;

    return ROLES_HIERARCHY.indexOf(role) >= 0;
}

/**
 * Validate a string
 * @param string
 */
function validateString(string) {
    return typeof string === 'string' && !isEmpty(string);
}

/**
 * Check if a string is empty
 * @param string {String}
 * @returns {boolean}
 */
function isEmpty(string) {
    string = string.trim();
    return string === '';
}


/**
 * Middleware to validate request params according to request path
 */
validation.validateParams = function(req, res, next) {
    debug('validateParams path', req.path);

    switch(true) {
        case /auth\/signup_oauth/.test(req.originalUrl):
            if(typeof req.user.signup_complete === 'undefined' || req.user.signup_complete === true)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Sign-Up Process has already been completed"});
            else if(!validateOauthSignup(req.body.info))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Please Provide all required fields"});
            break;

        case /auth\/signup/.test(req.originalUrl):
            if(!validateSignup(req.body.user))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Please Provide all required fields"});
            break;

        case /auth\/login/.test(req.originalUrl):
            if(!validateEmail(req.body.email) || !validatePassword(req.body.password))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Email or Password are incorrect"});
            break;
        case /auth\/changeEmailRequest/.test(req.originalUrl):
            if (!validateEmail(req.body.oldEmail) || !validateEmail(req.body.newEmail))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Emails are incorrect"});
            break;

        case /auth\/forgot/.test(req.originalUrl):
            if(req.isAuthenticated() && (req.user.googleId || req.user.facebookId))
                return res.status(HttpStatus.FORBIDDEN).send({errMessage: "User is signed in via OAuth2 provider"});

            if(!validateEmail(req.body.email) || !validatePassword(req.body.new_password) || !validatePassword(req.body.old_password))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Old or New Password is incorrect"});
            break;
        
        case /status\/update_status/.test(req.originalUrl):
            if(typeof req.body.active !== 'boolean')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid new status"});
            if(!req.body.message)
                req.body.mesage = '';
            break;

        case /renovation\/get_info/.test(req.originalUrl):
            if(!validateString(req.params.city) || !validateString(req.params.street) || !validateString(req.params.num))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address"});
            break;
        case /renovation\/create/.test(req.originalUrl):
        case /renovation\/rsvp/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address"});
            break;

        case /renovation\/add_tool/.test(req.originalUrl):
        case /renovation\/delete_tool/.test(req.originalUrl):
        case /renovation\/unassign_tool/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.tool === 'undefined')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or tool"});
            break;

        case /renovation\/assign_tool/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.tool === 'undefined' || !validateEmail(req.body.email))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address, tool or user email"});
            break;

        case /renovation\/add_task/.test(req.originalUrl):
        case /renovation\/delete_task/.test(req.originalUrl):
        case /renovation\/done_task/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.task === 'undefined')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or task"});
            break;

        case /renovation\/edit_task/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || !Array.isArray(req.body.tasks))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or task"});
            break;

        case /renovation\/assign_task/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.task === 'undefined' || !validateEmail(req.body.email))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address, task or user email"});
            break;

        case /renovation\/add_pinned/.test(req.originalUrl):
        case /renovation\/delete_pinned/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.pinned === 'undefined')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or pinned message"});
            break;

        case /renovation\/edit_pinned/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || !Array.isArray(req.body.pinneds))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or pinned message"});
            break;

        case /renovation\/add_stage/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || typeof req.body.stage === 'undefined' || typeof req.body.index === 'undefined')
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address or stage params"});
            break;
        
        case /renovation\/update_stage/.test(req.originalUrl):
            if(!validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num) || !validateString(req.body.stage))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid renovation address"});
            break;

        case /user\/approve/.test(req.originalUrl):
            if(!validateEmail(req.body.email) || !validateRole(req.body.role))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid user email or role"});
            break;

        case /user\/user_info/.test(req.originalUrl):
        case /user\/basic/.test(req.originalUrl):
        case /user\/delete/.test(req.originalUrl):
            if(!validateEmail(req.params.email))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid user email"});
            break;

        case /user\/assign_role/.test(req.originalUrl):
            if(!validateEmail(req.body.email) || !validateRole(req.body.newRole))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: 'No user or new role provided'});
            break;

        case /user\/update/.test(req.originalUrl):
            if(!validateEmail(req.body.email) || !validateRole(req.body.role) || !validateString(req.body.name) || !validatePhone(req.body.phone))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: 'Please Provide all required fields'});
            break;

        case /team\/create/.test(req.originalUrl):
            if(!validateString(req.body.teamName) || !validateEmail(req.body.email))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or email"});
            break;

        case /team\/get_team/.test(req.originalUrl):
        case /team\/delete/.test(req.originalUrl):
            if(!validateString(req.params.teamName))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name"});
            break;

        case /team\/add_members/.test(req.originalUrl):
        case /team\/remove_members/.test(req.originalUrl):
            if(!validateString(req.body.teamName) || !validateMembers(req.body.members))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or members emails"});
            break;

        case /team\/assign_to_renovation/.test(req.originalUrl):
            if(!validateString(req.body.teamName) || !validateString(req.body.city) || !validateString(req.body.street) || !validateString(req.body.num))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or renovation address"});
            break;
        
        case /team\/assign_manager/.test(req.originalUrl):
            if(!validateString(req.body.teamName) || !validateEmail(req.body.email))
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid team name or user email"});
            break;

        default:
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "No Validation Performed"});
    }
    return next();
};


module.exports = validation;