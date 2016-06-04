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

        mongoUtils.insert(COLLECTIONS.TEAMS, {name: req.body.teamName}, function (error, result) {
            debug('create insert', req.body.teamName, error, result);
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

        mongoUtils.delete(COLLECTIONS.TEAMS, {name: req.params.teamName}, function (error, result) {
            debug('delete', req.params.teamName, error, result);

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

        var members = JSON.parse(req.body.members);

        //Check members exists
        mongoUtils.query(COLLECTIONS.USERS, {email: {$in: members}}, function(error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add members from team"});
            else if (!result || result.length !== members.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Some members do not exists"});

            //Check Team exists
            mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.teamName}, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add members to team"});
                else if (!result || !result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

                //Separate new members from members already in team.
                var team = result[0];
                var alreadyInTeam = [];
                var newMembers = [];
                for (var i = 0; i < members.length; i++) {
                    if (team.members.indexOf(members[i]) < 0)
                        newMembers.push(members[i]);
                    else
                        alreadyInTeam.push(members[i]);
                }

                if (!newMembers.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "No new members to add"});

                //Add members to team
                mongoUtils.update(COLLECTIONS.TEAMS, {name: req.body.teamName}, {$push: {members: {$each: newMembers}}}, {},
                    function (error, result) {

                        if (error)
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add members to team"});

                        res.send({newMembersAdded: newMembers, alreadyInTeam: alreadyInTeam});
                    });
            });
        })

    });


/**
 * Remove members from a team
 */
router.post('/remove_members', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        var members = JSON.parse(req.body.members);

        //Check members exists
        mongoUtils.query(COLLECTIONS.USERS, {email: {$in: members}}, function(error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to remove members from team"});
            else if (!result || result.length !== members.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Some members do not exists"});

            //Check Team exists
            mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.teamName}, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to remove members from team"});
                else if (!result || !result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

                //Separate members to remove from members not in team
                var team = result[0];
                var notInTeam = [];
                var removeMembers = [];
                for (var i = 0; i < members.length; i++) {
                    if (team.members.indexOf(members[i]) < 0)
                        notInTeam.push(members[i]);
                    else
                        removeMembers.push(members[i]);
                }

                if (!removeMembers.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Members are not part of the specified team"});

                //Remove members from team
                mongoUtils.update(COLLECTIONS.TEAMS, {name: req.body.teamName}, {$pull: {members: {$each: removeMembers}}}, {},
                    function (error, result) {

                        if (error)
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to remove members from team"});

                        res.send({membersRemoved: removeMembers, notInTeam: notInTeam});
                    });
            });
        })
    });


/**
 * Assign team to a renovation
 */
router.post('/assign_to_renovation', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        //Check Team exists
        mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.teamName}, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});
            else if (!result || !result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

            //Check Renovation exists
            mongoUtils.query(COLLECTIONS.RENOVATIONS, renovation, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});
                else if (!result || !result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation does not exists"});

                //Assign team to renovation
                mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {team: req.body.teamName}}, {},
                    function (error, result) {

                        if (error || !result.nModified)
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign renovation to team"});

                        res.send({success: true});
                    })
            })
        })
    });


/**
 * Assign Team Manager
 */
router.post('/assign_manager', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    function (req, res) {

        //Check Team exists
        mongoUtils.query(COLLECTIONS.TEAMS, {name: req.body.teamName}, function (error, result) {

            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign manager to team"});
            else if (!result || !result.length)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Team does not exists"});

            var team = result[0];
            if(team.members && team.members.indexOf(req.body.email) < 0)
                return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User is not part of team"});

            //Check User exists
            mongoUtils.query(COLLECTIONS.USERS, {email: req.body.email}, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign manager to team"});
                else if (!result || !result.length)
                    return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User does not exists"});

                //Assign user as team manager
                mongoUtils.update(COLLECTIONS.TEAMS, {name: req.body.teamName}, {$set: {manager: req.body.email}}, {},
                    function(error, result) {

                        if(error || !result.nModified)
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign manager to team"});

                        res.send({success: true});
                })
            });
        });

    });

module.exports = router;