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
router.get('/get_info/:city&:street&:num', middleware.ensureAuthenticated, middleware.ensurePermission,
    validation.validateParams, function(req, res) {

    mongoUtils.query(COLLECTIONS.RENOVATIONS, {
        addr: {
            city: req.params.city,
            street: req.params.street,
            num: req.params.num
        }
    } , function (error, result) {

        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get renovation info"});
        else if(!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No renovation matches the address"});

        var renovation = result[0];

        var isRSVP = renovation.rsvp && renovation.rsvp.indexOf(req.user.email) > -1;

        //only TEAM_LEAD and above gets RSVP list
        if(ROLES_HIERARCHY.indexOf(req.user.role) < ROLES_HIERARCHY.indexOf(ROLES.TEAM_LEAD))
            delete renovation.rsvp;

        //TODO How will user get his own RSVP status if not team leader?
        res.send({isRSVP: isRSVP, renovation: renovation});
    })
});

/**
 * Get entire renovation collection
 */
router.get('/all', middleware.ensureAuthenticated, middleware.ensurePermission, function(req, res) {

    mongoUtils.query(COLLECTIONS.RENOVATIONS, {}, function(error, result) {
        if(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get renovations"});
        else if(!result.length)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No renovations found"});

        res.send(result);
    });
});


/**
 * Create a renovation
 */
router.post('/create', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function(req, res) {
        
        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        //Check if renovation already exists
        mongoUtils.query(COLLECTIONS.RENOVATIONS, renovation, function(error, result) {
            
            if(error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create renovation"});
            if(result && result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation already exists"});

            //create new renovation.
            mongoUtils.insert(COLLECTIONS.RENOVATIONS, renovation, function(error, result) {

                if(error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create renovation"});

                res.send({success: true})
            });
        })
});


/**
 * Edit a renovation
 */
router.post('/edit', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function(req, res) {

        //TODO if Team_LEAD, make sure the renovation belongs to his team
        
        


    });



module.exports = router;