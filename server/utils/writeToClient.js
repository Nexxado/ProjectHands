var debug = require('debug')('writeToClient');
var HttpStatus = require('http-status-codes');

module.exports = function writeToClient(response, data, error, status) {

    debug('data', data);
    debug('error', error);

    if (error) {
        if(!status)
            status = HttpStatus.BAD_REQUEST;
        response.status(status).send(error);
        return;
    }

    if(typeof data === 'object')
        response.json(data);
    else
        response.send(data);
};
