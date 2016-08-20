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
        case new RegExp(ACL.VIEW_EDIT_HOMEPAGE).test(req.originalUrl):
            req.action = ACL.VIEW_EDIT_HOMEPAGE;
            break;
        case /user\/basic/.test(req.originalUrl):
            req.action = ACL.USER_BASIC_INFO;
            break;
        case /user\//.test(req.originalUrl):
            req.action = ACL.USER_ACTIONS;
            break;
        case /team\//.test(req.originalUrl):
            req.action = ACL.TEAM_ACTIONS;
            break;
        case /renovation\/my_renovations/.test(req.originalUrl):
        case /renovation\/get_info/.test(req.originalUrl):
        case /renovation\/get_all_user/.test(req.originalUrl):
        case /renovation\/done_task/.test(req.originalUrl):
            req.action = ACL.RENOVATION_GET_INFO;
            break;
        case /renovation\/get_all/.test(req.originalUrl):
            req.action = ACL.RENOVATION_GET_ALL;
            break;
        case /renovation\/create/.test(req.originalUrl):
            req.action = ACL.RENOVATION_CREATE;
            break;
        case /renovation\/rsvp/.test(req.originalUrl):
            req.action = ACL.RENOVATION_RSVP;
            break;
        // case /renovation\/add_tool/.test(req.originalUrl):
        // case /renovation\/delete_tool/.test(req.originalUrl):
        // case /renovation\/update_stage/.test(req.originalUrl):
        // case /renovation\/add_task/.test(req.originalUrl):
        case /renovation\//.test(req.originalUrl):
            req.action = ACL.RENOVATION_EDIT;
            break;
        case /statistics\//.test(req.originalUrl):
            req.action = ACL.STATISTICS_ACTIONS ;
            break;
        case /photos\/renoGet/.test(req.originalUrl):
            req.action = ACL.PHOTOS_RENOVATION_GET;
            break;
        case /photos\/reno/.test(req.originalUrl):
            req.action = ACL.PHOTOS_RENOVATION_EDIT;
            break;
        case /photos\/home/.test(req.originalUrl):
            req.action = ACL.PHOTOS_HOME;
            break;
        case /photos\/profile/.test(req.originalUrl):
            req.action = ACL.PHOTOS_PROFILE;
            break;
        case /home\//.test(req.originalUrl):
            req.action = ACL.HOME_ACTIONS;
            break;
    }

    next();
};
