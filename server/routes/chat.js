/**
 * Created by ND88 on 21/05/2016.
 */
var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/chat');
var writeToClient = require('../utils/writeToClient');
var CHATS = require('../../config.json').COLLECTIONS.CHATS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');


router.get('/history/:chatId', middleware.ensureAuthenticated, function(req, res) {

    if(!req.params.chatId)
        res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Invalid Chat Id"});

    mongoUtils.query(CHATS, {_id: req.params.chatId}, function(error, result) {

        debug('history',  req.params.chatId, 'result', result);
        debug('history error', error);
        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Error getting chat history"});

        res.send(result[0]);
    })
});

module.exports = router;
