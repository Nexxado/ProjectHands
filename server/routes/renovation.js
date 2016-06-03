var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/renovation');
var config = require('../../config.json');
var ROLES = config.ROLES;
var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) {
    return ROLES[key];
}).reverse();
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');

/**
 * Get a renovation's info according to its address (city, street name, house number)
 */
router.get('/get_info/:city/:street/:num', middleware.ensureAuthenticated, middleware.ensurePermission,
    validation.validateParams, function (req, res) {

        mongoUtils.query(COLLECTIONS.RENOVATIONS, {
            addr: {
                city: req.params.city,
                street: req.params.street,
                num: req.params.num
            }
        }, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get renovation info"});
            else if (!result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No renovation matches the address"});

            var renovation = result[0];

            var isRSVP = renovation.rsvp && renovation.rsvp.indexOf(req.user.email) > -1;

            //only TEAM_LEAD and above gets RSVP list
            if (ROLES_HIERARCHY.indexOf(req.user.role) < ROLES_HIERARCHY.indexOf(ROLES.TEAM_LEAD))
                delete renovation.rsvp;


            res.send({isRSVP: isRSVP, renovation: renovation});
        })
    });

/**
 * Get entire renovation collection
 */
router.get('/get_all', middleware.ensureAuthenticated, middleware.ensurePermission, function (req, res) {

    mongoUtils.query(COLLECTIONS.RENOVATIONS, {}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get renovations"});
        else if (!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No renovations found"});

        res.send(result);
    });
});


/**
 * Create a renovation
 */
router.post('/create', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        //Check if renovation already exists
        mongoUtils.query(COLLECTIONS.RENOVATIONS, renovation, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create renovation"});
            else if (result && result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation already exists"});

            //create new renovation.
            mongoUtils.insert(COLLECTIONS.RENOVATIONS, renovation, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create renovation"});

                res.send({success: true})
            });
        })
    });


/**
 * Edit a renovation
 */
router.post('/edit', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        //TODO if Team_LEAD, make sure the renovation belongs to his team


    });


/**
 * Change user's RSVP status for Renovation
 */
router.post('/rsvp', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        var db_action;
        var rsvpStatus;
        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        //Check if renovation exists
        mongoUtils.query(COLLECTIONS.RENOVATIONS, renovation, function(error, result) {
            
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to change rsvp status"});
            else if (!result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation does not exists"});
            
            var renovation = result[0];
            var team_name = renovation.team;
            if(!team_name)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation does not have a team assigned"});

            //Check if team exists
            mongoUtils.query(COLLECTIONS.TEAMS, {name: team_name}, function(error, result) {
                
                if(error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to change rsvp status"});
                else if(!result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});
                
                var team = result[0];
                if(team.members && team.members.indexOf(req.user.email) < 0)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User is not part of renovation team"});
                
                //Determine new RSVP status
                if(renovation.rsvp && renovation.rsvp.indexOf(req.user.email) > -1) {
                    db_action = {$pull: {rsvp: req.user.email}};
                    rsvpStatus = false;
                }
                else {
                    db_action = {$push: {rsvp: req.user.email}};
                    rsvpStatus = true;
                }
                
                //Update RSVP status
                mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, db_action, {}, function(error, result) {

                    if(error || !result.nModified)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to change rsvp status"});

                    res.send({rsvp: rsvpStatus});
                });
                
            })
        })
    });


module.exports = router;