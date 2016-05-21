/**
 * Created by ND88 on 21/05/2016.
 */
var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/chat');
var writeToClient = require('../utils/writeToClient');
var CHATS = require('../../config.json').COLLECTIONS.CHATS;
var mongoUtils = require('../utils/mongo');


router.get('/history/:chatId', ensureAuthenticated, function(req, res) {

    if(!req.params.chatId)
        return writeToClient(res, null, {errMessage: "Invalid Chat Id"}, HttpStatus.BAD_REQUEST);

    mongoUtils.query(CHATS, {_id: req.params.chatId}, function(error, result) {

        debug('history',  req.params.chatId, 'result', result);
        debug('history error', error);
        if(error)
            return writeToClient(res, result, error, HttpStatus.INTERNAL_SERVER_ERROR);

        writeToClient(res, result);
    })
});


/**
 * Middleware - Make sure user is logged in
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    return writeToClient(res, null, "Error: User is not logged in", HttpStatus.UNAUTHORIZED);
}

module.exports = router;
