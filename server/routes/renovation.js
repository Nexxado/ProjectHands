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
 * Renovation CRUD routes
 */
router.get('/get_info/:city/:street/:num', middleware.ensureAuthenticated, middleware.ensurePermission,
    validation.validateParams, middleware.ensureRenovationExists, getRenovationInfo);

router.get('/get_all', middleware.ensureAuthenticated, middleware.ensurePermission, getAllRenovations);

router.get('/get_all_user', middleware.ensureAuthenticated, middleware.ensurePermission, middleware.getUsersTeam,
    getAllUserRenovations);

router.get('/get_future', middleware.ensureAuthenticated, middleware.ensurePermission, getAllFutureRenovations);

router.get('/my_renovations', middleware.ensureAuthenticated, middleware.ensurePermission, getUserRenovations);

router.post('/finish', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, createRenovationStamp, finishRenovation);

router.post('/create', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    createRenovation);

/**
 * Renovation Tools
 */
router.get('/tools', middleware.ensureAuthenticated, middleware.ensurePermission, getTools);

router.post('/set_tools', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, setRenovationTools);

router.post('/add_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, addTool);

router.post('/assign_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, middleware.ensureUserExists, assignToolToUser);

router.post('/shed_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, assignToolToShed);

router.post('/unassign_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, unassignTool);

router.post('/delete_tool', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, deleteTool);

/**
 * Renovation Tasks
 */
router.post('/add_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, addTask);

router.post('/assign_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, middleware.ensureUserExists, assignTask);

router.post('/done_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, doneTask);

router.post('/edit_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, editTask);

router.post('/delete_task', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, deleteTask);

/**
 * Renovation Pinned messages
 */
router.post('/add_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, addPinned);

router.post('/edit_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, editPinned);

router.post('/delete_pinned', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, deletePinned);

/**
 * Renovation Stages
 */
router.post('/add_stage', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, addStage);

router.post('/update_stage', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, updateStage);

/**
 * RSVP
 */
router.post('/rsvp', middleware.ensureAuthenticated, middleware.ensurePermission, validation.validateParams,
    middleware.ensureRenovationExists, middleware.ensureRenovationNotFinished, middleware.ensureTeamExists, rsvp);


module.exports = router;

/**
 * Get a renovation's info according to its address (city, street name, house number)
 */
function getRenovationInfo(req, res) {

    var isRSVP = req.queriedRenovation.rsvp && req.queriedRenovation.rsvp.indexOf(req.user.email) > -1;

    //only TEAM_LEAD and above gets RSVP list
    if (ROLES_HIERARCHY.indexOf(req.user.role) < ROLES_HIERARCHY.indexOf(ROLES.TEAM_LEAD))
        delete req.queriedRenovation.rsvp;


    res.send({isRSVP: isRSVP, renovation: req.queriedRenovation});
}


/**
 * Get entire renovation collection
 */
function getAllRenovations(req, res) {

    mongoUtils.query(COLLECTIONS.RENOVATIONS, {}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find renovations"});

        res.send(result);
    });
}

/**
 * Get all the renovations of the logged in user
 */
function getAllUserRenovations(req, res) {

    var query = {};

    if (req.queriedTeam)
        query["$or"] = [
            {"stamp.members": req.user.email},
            {team: req.queriedTeam.name}
        ];
    else
        query["stamp.members"] = req.user.email;


    mongoUtils.query(COLLECTIONS.RENOVATIONS, query, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find renovations"});

        res.send(result);
    });

}


/**
 * Get all future renovations in the database
 */
function getAllFutureRenovations(req, res) {

    var date = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    var query = {$or: [{date: {$gte: date.toISOString()}}, {date: {$exists: false}}]};

    mongoUtils.query(COLLECTIONS.RENOVATIONS, query, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to find renovations"});

        res.send(result);
    });
}

/**
 * get current user's renovations - previous and upcoming.
 * @param req
 * @param res
 */
function getUserRenovations(req, res) {
    //get user's teams
    mongoUtils.query(COLLECTIONS.TEAMS, {members: req.user.email}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: 'failed to get user\'s team'});

        //search for user in renovation stamp
        var query = {$or: [{'stamp.members': req.user.email}]};

        //add user's team names to query
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                query.$or.push({team: result[i].name});
            }
        }

        mongoUtils.query(COLLECTIONS.RENOVATIONS, query, function (error, result) {
            if (error)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: 'failed to get user\'s renovations'});

            res.send(result);
        });
    });
}

/**
 * Create a new renovation in the database
 */
function createRenovation(req, res) {

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

        //Initialize new renovation
        renovation.finished = false;
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
}

/**
 * Get default tools list
 */
function getTools(req, res) {
    mongoUtils.query(COLLECTIONS.TOOLS, {}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to get tools"});

        res.send(result);
    });
}

/**
 * Set renovation tools to given tools
 */
function setRenovationTools(req, res) {
    var renovation = {
        addr: {
            city: req.body.city,
            street: req.body.street,
            num: req.body.num
        }
    };

    mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {toolsNeeded: req.body.tools}}, {},
        function (error, result) {
            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to update renovation tools"});

            res.send({success: true});
        })
}

/**
 * Add needed Tool to renovation
 */
function addTool(req, res) {

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

}


/**
 * Assign tool to volunteer
 */
function assignToolToUser(req, res) {

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

}

/**
 * Assign tool to be brought from shed
 */
function assignToolToShed(req, res) {

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
                "toolsNeeded.$.assigned": "shed"
            }
        }, {},
        function (error, result) {

            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to assign tool to shed"});

            res.send({success: true});
        });

}

/**
 * unassign tool
 */
function unassignTool(req, res) {

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

}

/**
 * Delete tool from renovation
 */
function deleteTool(req, res) {

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

}

/**
 * Add new task to renovation
 */
function addTask(req, res) {

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

}

/**
 * Assign task to team member
 */
function assignTask(req, res) {

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

}

/**
 * Mark task in renovation as done
 */
function doneTask(req, res) {

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

}

/**
 * Edit task
 */
function editTask(req, res) {

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

}

/**
 * Delete task from renovation
 */
function deleteTask(req, res) {

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

}

/**
 * Add pinned message to renovation
 */
function addPinned(req, res) {

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

}

/**
 * Edit pinned message
 */
function editPinned(req, res) {

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

}

/**
 * Delete pinned message from renovation
 */
function deletePinned(req, res) {

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

}

/**
 * Add new custom stage to renovation
 */
function addStage(req, res) {

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

}

/**
 * Update Renovation stage
 */
function updateStage(req, res) {
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
}

/**
 * Change user's RSVP status for Renovation
 */
function rsvp(req, res) {

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
}

/**
 * Create a renovation stamp including the current date, renovation team and its members
 * will be used to stamp the renovation team data into the renovation
 */
function createRenovationStamp(req, res, next) {

    mongoUtils.query(COLLECTIONS.TEAMS, {name: req.queriedRenovation.team}, function (error, result) {
        if (error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to mark renovation as finished"});

        var team = result[0];
        req.stamp = {
            date: new Date().toISOString(),
            team: team ? team.name : 'No Team',
            members: team ? team.members : []
        };
        next();
    });
}

/**
 * Stamp the renovation and mark it as finished.
 */
function finishRenovation(req, res) {

    var renovation = {
        addr: {
            city: req.body.city,
            street: req.body.street,
            num: req.body.num
        }
    };

    mongoUtils.update(COLLECTIONS.RENOVATIONS, renovation, {$set: {finished: true, stamp: req.stamp}}, {},
        function (error, result) {
            if (error || result.result.nModified === 0)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({errMessage: "Failed to mark renovation as finished"});

            res.send({success: true})
        });
}