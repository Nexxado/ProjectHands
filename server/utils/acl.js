var config = require('../../config.json');
var ACL = config.ACL;

module.exports = function (req, res, next) {
    switch (true) {
        case /status\/update_status/.test(req.originalUrl):
            req.action = ACL.CHANGE_STATUS;
            break;
        case /dataexchange\//.test(req.originalUrl):
            req.action = ACL.DATA_IMPORT_EXPORT;
            break;
        case new RegExp(ACL.VIEW_DASHBOARD).test(req.originalUrl):
            req.action = ACL.VIEW_DASHBOARD;
            break;
        case /user\//.test(req.originalUrl):
            req.action = ACL.USER_ACTIONS;
            break;
        case /team\//.test(req.originalUrl):
            req.action = ACL.TEAM_ACTIONS;
            break;
        case /renovation\/get_info/.test(req.originalUrl):
            req.action = ACL.RENOVATION_GET_INFO;
            break;
        case /renovation\/get_all/.test(req.originalUrl):
            req.action = ACL.RENOVATION_GET_ALL;
            break;
        case /renovation\/create/.test(req.originalUrl):
            req.action = ACL.RENOVATION_CREATE;
            break;
        case /renovation\/edit/.test(req.originalUrl):
            req.action = ACL.RENOVATION_EDIT;
            break;
    }

    next();
};
