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
    validation.validateParams, middleware.ensureRenovationExists, function (req, res) {

        var isRSVP = req.queriedRenovation.rsvp && req.queriedRenovation.rsvp.indexOf(req.user.email) > -1;

        //only TEAM_LEAD and above gets RSVP list
        if (ROLES_HIERARCHY.indexOf(req.user.role) < ROLES_HIERARCHY.indexOf(ROLES.TEAM_LEAD))
            delete req.queriedRenovation.rsvp;


        res.send({isRSVP: isRSVP, renovation: req.queriedRenovation});
    });

/**
 * Get entire renovation collection
 */
router.get('/get_all', middleware.ensureAuthenticated, middleware.ensurePermission, function (req, res) {

    mongoUtils.query(COLLECTIONS.RENOVATIONS, {}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find renovations"});
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

            //TODO Move to separate method
            renovation.tasks = [];
            renovation.pinned = [];
            renovation.toolsNeeded = [];
            renovation.rsvp = [];
            renovation.renovation_stages = [
                "ביקור ראשוני בדירה לבדיקת התאמה",
                "הוחלט לשפץ, יש צורך לעדכן עובד סוציאלי",
                "עובד סוציאלי עודכן, יש צורך לשבץ צוות",
                "על ראש הצוות להגיע לביקור לצרכי תכנון",
                "שלב ההכנות לשיפוץ",
                "הדירה בשיפוץ",
                "הסתיים השיפוץ"
            ];
            renovation.current_stage = renovation.renovation_stages[0];
            renovation.created = new Date();
            renovation.chat_id = req.body.city + ' ' + req.body.street + ' ' + req.body.num;

            //create new renovation.
            mongoUtils.insert(COLLECTIONS.RENOVATIONS, renovation, function (error, result) {

                if (error)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create renovation"});

                res.send({success: true})
            });
        })
    });

/**
 * Add needed Tool to renovation
 */
router.post('/add_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$push: {toolsNeeded: req.body.tool}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add tool"});

                res.send({success: true});
            });

    });


/**
 * Assign tool to user
 */
router.post('/assign_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureUserExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "toolsNeeded.name": req.body.tool.name
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {
                $set: {
                    "toolsNeeded.$.being_brought": "true",
                    "toolsNeeded.$.assigned": req.body.email
                }
            }, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign tool"});

                res.send({success: true});
            });

    });


/**
 * Unassign tool from user
 */
router.post('/unassign_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "toolsNeeded.name": req.body.tool.name
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {
                $set: {
                    "toolsNeeded.$.being_brought": "false",
                    "toolsNeeded.$.assigned": ""
                }
            }, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to unassign tool"});

                res.send({success: true});
            });

    });


/**
 * Delete tool needed from renovation
 */
router.post('/delete_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$pull: {toolsNeeded: {name: req.body.tool.name}}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete tool"});

                res.send({success: true});
            });

    });


/**
 * Add new task to renovation
 */
router.post('/add_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$push: {tasks: req.body.task}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create new task"});

                res.send({success: true});
            });

    });


/**
 * Assign task to team member
 */
router.post('/assign_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureUserExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "tasks.name": req.body.task.name
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {"tasks.$.assigned_email": req.body.email}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign task"});

                res.send({success: true});
            });

    });

/**
 * Mark task in renovation as done
 */
router.post('/done_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "tasks.name": req.body.task.name
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {"tasks.$.done": "true"}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to mark task as done"});

                res.send({success: true});
            });

    });


/**
 * Edit task
 */
router.post('/edit_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "tasks.name": req.body.tasks[0].name
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {
                $set: {
                    "tasks.$.name": req.body.tasks[1].name,
                    "tasks.$.description": req.body.tasks[1].description,
                    "tasks.$.assigned_email": req.body.tasks[1].assigned_email,
                    "tasks.$.done": req.body.tasks[1].done
                }
            }, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to edit task"});

                res.send({success: true});
            });

    });


/**
 * Delete task from renovation
 */
router.post('/delete_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$pull: {tasks: {name: req.body.task.name}}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete task"});

                res.send({success: true});
            });

    });

/**
 * Add pinned message to renovation
 */
router.post('/add_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$push: {pinned: req.body.pinned}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to create new pinned message"});

                res.send({success: true});
            });

    });


/**
 * Edit pinned message
 */
router.post('/edit_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            },
            "pinned.title": req.body.pinneds[0].title
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {
                $set: {
                    "pinned.$.title": req.body.pinneds[1].title,
                    "pinned.$.description": req.body.pinneds[1].description,
                    "pinned.$.added_date": req.body.pinneds[1].added_date
                }
            }, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to edit pinned message"});

                res.send({success: true});
            });

    });

/**
 * Delete pinned message from renovation
 */
router.post('/delete_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$pull: {pinned: {title: req.body.pinned.title}}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to delete pinned message"});

                res.send({success: true});
            });

    });

/**
 * Add new custom stage to renovation
 */
router.post('/add_stage', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {

        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {
                $push: {
                    renovation_stages: {
                        $each: [req.body.stage.title],
                        $position: req.body.index
                    }
                }
            }, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to add new renovation stage"});

                res.send({success: true});
            });

    });

/**
 * Update Renovation stage
 */
router.post('/update_stage', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, function (req, res) {
        var renovation = {
            addr: {
                city: req.body.city,
                street: req.body.street,
                num: req.body.num
            }
        };

        mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {current_stage: req.body.stage}}, {},
            function (error, result) {

                if (error || result.result.nModified === 0)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to update renovation stage"});

                res.send({success: true});
            });
    });


/**
 * Change user's RSVP status for Renovation
 */
router.post('/rsvp', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureTeamExists, function (req, res) {

        var db_action;
        var rsvpStatus;

        if (!req.queriedRenovation.team)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "Renovation does not have a team assigned"});


        if (req.queriedTeam.members && req.queriedTeam.members.indexOf(req.user.email) < 0)
            return res.status(HttpStatus.BAD_REQUEST).send({errMessage: "User is not part of renovation team"});

        //Determine new RSVP status
        if (req.queriedRenovation.rsvp && req.queriedRenovation.rsvp.indexOf(req.user.email) > -1) {
            db_action = {$pull: {rsvp: req.user.email}};
            rsvpStatus = false;
        }
        else {
            db_action = {$push: {rsvp: req.user.email}};
            rsvpStatus = true;
        }

        //Update RSVP status
        mongoUtils.update(COLLECTIONS.RENOVATIONS, {addr: req.queriedRenovation.addr}, db_action, {}, function (error, result) {

            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to change rsvp status"});

            res.send({rsvp: rsvpStatus});
        });
    });


module.exports = router;