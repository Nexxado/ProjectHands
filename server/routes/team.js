var router = require('express').Router();
var HttpStatus = require('http-status-codes');
var debug = require('debug')('routes/team');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('../utils/mongo');
var middleware = require('../utils/middleware');
var validation = require('../utils/validation');


/**
 * Create a Team
 */
router.post('/create', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        mongoUtils.insert(COLLECTIONS.TEAMS, {name: req.body.name}, function (error, result) {
            debug('create insert', error, result);
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create team"});

            res.send({success: true});
        });
    });

/**
 * Delete a Team
 */
router.delete('/delete/:name', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        mongoUtils.delete(COLLECTIONS.TEAMS, {name: req.params.name}, function (error, result) {
            debug('delete', req.params.name, error, result);

            if (error || !result.nRemoved)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete team"});

            res.send({success: true})
        });

    });

/**
 * Add members to team
 */
router.post('/add_members', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.name}, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add members to team"});
            else if (!result || !result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

            //Separate new members from members already in team.
            var team = result[0];
            var alreadyInTeam = [];
            var newMembers = [];
            for (var i = 0; i < req.body.members.length; i++) {
                if (team.members.indexOf(req.body.members[i]) < 0)
                    newMembers.push(req.body.members[i]);
                else
                    alreadyInTeam.push(req.body.members[i]);
            }

            if(!newMembers.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No new members to add"});

            mongoUtils.update(COLLECTIONS.TEAMS, {name: req.body.name}, {$push: {members: {$each: newMembers}}}, {},
                function(error, result) {

                    if(error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add members to team"});

                    res.send({newMembersAdded: newMembers, alreadyInTeam: alreadyInTeam});
                });
        });

    });


/**
 * Remove members from a team
 */
router.post('/remove_members', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.name}, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to remove members from team"});
            else if (!result || !result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

            //Separate members to remove from members not in team
            var team = result[0];
            var notInTeam = [];
            var removeMembers = [];
            for (var i = 0; i < req.body.members.length; i++) {
                if (team.members.indexOf(req.body.members[i]) < 0)
                    notInTeam.push(req.body.members[i]);
                else
                    removeMembers.push(req.body.members[i]);
            }

            if (!removeMembers.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Members are not part of the specified team"});

            mongoUtils.update(COLLECTIONS.TEAMS, {name: req.body.name}, {$pull: {members: {$each: removeMembers}}}, {},
                function (error, result) {

                    if (error)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to remove members from team"});

                    res.send({membersRemoved: removeMembers, notInTeam: notInTeam});
                });
        });
    });


/**
 * Assign team to a renovation
 */
router.post('/assign_to_renovation', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams, 
    function(req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.name}, function(error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});
            else if (!result || !result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

            mongoUtils.query(COLLECTIONS.RENOVATIONS, renovation, function(error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});
                else if (!result || !result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation does not exists"});

                mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {team: req.body.name}}, {}, 
                    function(error, result) {

                        if (error || !result.nModified)
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});
                    
                        res.send({success: true});
                })
            })
        })
    
});

module.exports = router;