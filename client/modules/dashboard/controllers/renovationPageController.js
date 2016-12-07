/**
 * Created by DDraiman1990 on May 2016.
 */
angular.module('ProjectHands.dashboard')

    .controller('RenovationPageController', function ($scope, $stateParams, $mdSidenav, $mdMedia, $mdDialog,
                                                      RenovationService, TeamService, UserService, DatabaseService, COLLECTIONS, UtilsService) {


        console.log("My role is: ", $scope.user.role);
        /******Variables Declarations******/
        $scope.thisRenovation = "";
        $scope.renovationNotFound = false;
        $scope.renovationTeam = "";
        $scope.editMessagesMode = false;
        $scope.editTasksMode = false;
        $scope.editToolsMode = false;
        $scope.editStagesMode = false;
        $scope.lastStage = "";
        $scope.minDate = "";
        $scope.needToAssignTeam = "";
        $scope.renovationChatRoom = "";
        $scope.renovationStages = "";
        $scope.renovationCurrentStage = "";
        $scope.renovationProgress = 0;
        $scope.renovationMembers = [];
        $scope.renovationStageImage = "";
        $scope.defaultStagesImages = [
            "/assets/img/renovation-page/first-visit.png",
            "/assets/img/renovation-page/social-worker.png",
            "/assets/img/renovation-page/team.png",
            "/assets/img/renovation-page/team-leader-visit.png",
            "/assets/img/renovation-page/planning.png",
            "/assets/img/renovation-page/renovating.png",
            "/assets/img/renovation-page/renovation-done.png",
            "/assets/img/renovation-page/extra-stage.png"
        ];

        $scope.headerImages = [
            "/assets/img/renovation-page/headers/renoPageHeader1.png",
            "/assets/img/renovation-page/headers/renoPageHeader2.png",
            "/assets/img/renovation-page/headers/renoPageHeader3.png",
            "/assets/img/renovation-page/headers/renoPageHeader4.png",
            "/assets/img/renovation-page/headers/renoPageHeader5.png",
            "/assets/img/renovation-page/headers/renoPageHeader6.png",
        ];
        $scope.currentHeaderImage = $scope.headerImages[Math.floor((Math.random() * 6))];
        $scope.allTeams = [];
        TeamService.getAllTeams()
            .$promise.then(function (result) {
            $scope.allTeams = result;
        })
            .catch(function (error) {
                console.log("Error: ", error);
            });

        /******Getters******/

        $scope.checkUserInTeam = function (email) {
            if ($scope.renovationTeam === null || $scope.renovationTeam === "" || $scope.renovationMembers.length === 0) {
                return false;
            }
            if ($scope.getMemberName(email) !== null) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.checkMemberFound = function (name) {
            return name !== null;
        };

        $scope.checkTaskDone = function (done) {
            return done === "true";
        };

        $scope.checkToolBeingBrought = function (brought) {
            return brought === "true";
        };

        $scope.getMemberName = function (email) {
            for (var i in $scope.renovationMembers) {
                if ($scope.renovationMembers[i].email === email)
                    return $scope.renovationMembers[i].name;
            }
            return null;
        };

        $scope.getRenovationTeam = function (teamName) {
            TeamService.getTeam(teamName).$promise
                .then(function (result) {
                    if (result) {
                        $scope.renovationTeam = result;
                        $scope.getRenovationMembers($scope.renovationTeam);
                    }

                })
                .catch(function (error) {
                    console.log("Error: ", error);
                });

        };

        $scope.getRenovationMembers = function (team) {
            $scope.renovationMembers = [];
            console.log("getting members for ", team.name);
            for (var i in team.members) {
                $scope.pushMemberByMail(team.members[i]);
            }
            $scope.initializeVariables();

        };

        $scope.pushMemberByMail = function (email) {
            UserService.getBasicUserInfo(email).$promise
                .then(function (result) {
                    $scope.renovationMembers.push(result);
                })
                .catch(function (error) {
                    console.log("Error: ", error);
                });
        };


        RenovationService.getRenovation({
            city: $stateParams.city,
            street: $stateParams.street,
            num: $stateParams.num
        })
            .$promise.then(function (result) {
            $scope.thisRenovation = result.renovation;
            console.log("THIS RENOVATION IS ", result.renovation);
            if (!$scope.thisRenovation.rsvp) {
                $scope.thisRenovation.rsvp = [];
            }
            $scope.getRenovationTeam($scope.thisRenovation.team);
        }).catch(function (error) {
            console.log("Error: ", error);
        });


        /******Initialize more Variables******/
        $scope.initializeVariables = function () {
            console.log("Initialized Variables");
            console.log("this reno is: ", $scope.thisRenovation);
            $scope.minDate = new Date();
            $scope.renovationChatRoom = [$scope.thisRenovation.chat_id];
            $scope.renovationStages = $scope.thisRenovation.renovation_stages;
            console.log("reno stages ", $scope.renovationStages);
            $scope.renovationCurrentStage = $scope.thisRenovation.current_stage;
            $scope.needToAssignTeam = ($scope.renovationCurrentStage === $scope.defaultRenoStages[2]);
            $scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));
            $scope.getStageImage();

            console.log("reno stage ", $scope.renovationCurrentStage);
        };

        $scope.getStageImage = function () {
            console.log("Getting stage image");
            console.log("image was: ", $scope.renovationStageImage);
            var index = $scope.defaultRenoStages.indexOf($scope.renovationCurrentStage);
            if (index === -1)
                index = $scope.defaultStagesImages.length - 1;
            $scope.renovationStageImage = $scope.defaultStagesImages[index];
            console.log("image is now: ", $scope.renovationStageImage);
        };

        /******Editing Mode Functions******/
        $scope.editMessages = function () {
            $scope.editMessagesMode = !$scope.editMessagesMode;
        };

        $scope.editTasks = function () {
            $scope.editTasksMode = !$scope.editTasksMode;
        };

        $scope.editTools = function () {
            $scope.editToolsMode = !$scope.editToolsMode;
        };

        $scope.editPinned = function ($event, pinned) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog, oldPinned) {
                    $scope.pinned = {
                        title: oldPinned.title,
                        description: oldPinned.description,
                        added_date: oldPinned.added_date,
                    };
                    $scope.pinneds = [];
                    $scope.pinneds.push(oldPinned);
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddPinnedForm.$invalid) {
                            return;
                        }
                        $scope.pinneds.push($scope.pinned)
                        $mdDialog.hide($scope.pinneds);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addPinnedDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {
                    oldPinned: pinned
                }
            })
                .then(function (pinneds) {
                    RenovationService.editPinned($scope.thisRenovation.addr, pinneds)
                        .$promise.then(function (result) {
                        for (var i in $scope.thisRenovation.pinned) {
                            if ($scope.thisRenovation.pinned[i].title === pinneds[0].title) {
                                $scope.thisRenovation.pinned[i].title = pinneds[1].title;
                                $scope.thisRenovation.pinned[i].description = pinneds[1].description;
                                $scope.thisRenovation.pinned[i].added_date = pinneds[1].added_date;
                                break;
                            }
                        }
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });

                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };

        $scope.editTask = function ($event, task) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog, oldTask) {
                    $scope.task = {
                        name: oldTask.name,
                        description: oldTask.description,
                        assigned_email: oldTask.assigned_email,
                        done: oldTask.done
                    };
                    $scope.tasks = [];
                    $scope.tasks.push(oldTask);
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddTaskForm.$invalid) {
                            return;
                        }
                        $scope.tasks.push($scope.task)
                        $mdDialog.hide($scope.tasks);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addTaskDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {
                    oldTask: task
                }
            })
                .then(function (tasks) {
                    RenovationService.editTask($scope.thisRenovation.addr, tasks)
                        .$promise.then(function (result) {
                        for (var i in $scope.thisRenovation.tasks) {
                            if ($scope.thisRenovation.tasks[i].name === tasks[0].name) {
                                $scope.thisRenovation.tasks[i].name = tasks[1].name;
                                $scope.thisRenovation.tasks[i].description = tasks[1].description;
                                $scope.thisRenovation.tasks[i].assigned_email = tasks[1].assigned_email;
                                $scope.thisRenovation.tasks[i].done = tasks[1].done;
                                break;
                            }
                        }
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });

                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };

        /******Misc Functions******/
        $scope.calcRenoProgress = function () {
            $scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));
        };


        /******Adding Dialogs******/
        /*TODO: switch with the appropriate route for each updating of the variables*/
        $scope.addTask = function ($event) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
                    $scope.task = {
                        name: "",
                        description: "",
                        assigned_email: "",
                        done: false
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddTaskForm.$invalid) {
                            return;
                        }
                        $mdDialog.hide($scope.task);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addTaskDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {}
            })
                .then(function (newTask) {
                    //Check for duplicates in tasks
                    for (var i in $scope.thisRenovation.tasks) {
                        if ($scope.thisRenovation.tasks[i].name === newTask.name) {
                            $scope.constructionToast('top right');
                            throw new Error("Task Title already exists. Please choose a different title");
                        }
                    }
                    RenovationService.addTask($scope.thisRenovation.addr, newTask)
                        .$promise.then(function (result) {
                        $scope.thisRenovation.tasks.push(newTask);
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });
                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };

        $scope.addPinned = function ($event) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
                    $scope.today = new Date();
                    $scope.pinned = {
                        title: "",
                        description: "",
                        added_date: "" + $scope.today.getDate() + "/" + ($scope.today.getMonth() + 1) + "/" + $scope.today.getFullYear()
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddPinnedForm.$invalid) {
                            return;
                        }
                        $mdDialog.hide($scope.pinned);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addPinnedDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {}
            })
                .then(function (newPinned) {
                    //Check for duplicates in pinned
                    for (var i in $scope.thisRenovation.pinned) {
                        if ($scope.thisRenovation.pinned[i].title === newPinned.title) {
                            $scope.constructionToast('top right');
                            throw new Error("Pinned Title already exists. Please choose a different title");
                        }
                    }
                    RenovationService.addPinned($scope.thisRenovation.addr, newPinned)
                        .$promise.then(function (result) {
                        $scope.thisRenovation.pinned.push(newPinned);
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });
                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };

        $scope.addStage = function ($event) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog, renovation_stages) {
                    $scope.stages = renovation_stages;
                    $scope.stage = {
                        title: "",
                        after_stage: ""
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddStageForm.$invalid) {
                            return;
                        }
                        $mdDialog.hide($scope.stage);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addStageDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {
                    renovation_stages: $scope.thisRenovation.renovation_stages

                }
            })
                .then(function (newStage) {
                    //Check for duplicates in pinned
                    for (var i in $scope.thisRenovation.renovation_stages) {
                        if ($scope.thisRenovation.renovation_stages[i] === newStage) {
                            $scope.constructionToast('top right');
                            throw new Error("Stage already exists");
                        }
                    }
                    var push_index = $scope.thisRenovation.renovation_stages.indexOf(newStage.after_stage) + 1;
                    RenovationService.addStage($scope.thisRenovation.addr, newStage, push_index)
                        .$promise.then(function (result) {
                        $scope.thisRenovation.renovation_stages.splice(push_index, 0, newStage.title);
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });
                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };

        $scope.addTool = function ($event) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            $mdDialog.show({
                controller: 'ToolsDialogController',
                templateUrl: '/modules/dashboard/templates/dialogs/addToolDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {
                    toolsInRenovation: $scope.thisRenovation.toolsNeeded
                }
            })
                .then(function (tools) {

                    $scope.thisRenovation.toolsNeeded = tools;
                    RenovationService.setRenovationTools($scope.thisRenovation.addr, tools).$promise
                        .then(function (result) {
                            $scope.thisRenovation.toolsNeeded = tools;
                        })
                        .catch(function (error) {
                            console.log("Error: ", error);
                        });
                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };


        /******Stages Editing functions******/
        $scope.finishRenovation = function () {
            $scope.thisRenovation.finished = true;
            $scope.renovations.splice($scope.renovations.indexOf($scope.thisRenovation), 1);
            $scope.finishedRenovations.push($scope.thisRenovation);
            RenovationService.finish($scope.thisRenovation.addr);
        };

        $scope.enableEditStages = function () {
            $scope.editStagesMode = true;
            $scope.lastStage = $scope.renovationCurrentStage;
        };

        $scope.disableEditStages = function () {
            $scope.editStagesMode = false;
            if ($scope.lastStage != $scope.renovationCurrentStage) {
                RenovationService.updateStage($scope.thisRenovation.addr, $scope.renovationCurrentStage)
                    .$promise.then(function (result) {
                }).catch(function (error) {
                    console.log("Error: ", error);
                    //if there was a problem, go back to the last stage that was valid
                    $scope.renovationCurrentStage = $scope.lastStage;
                });
                $scope.needToAssignTeam = $scope.renovationCurrentStage === "עובד סוציאלי עודכן, יש צורך לשבץ צוות";
            }

        };

        $scope.nextStage = function () {
            var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
            index++;
            if (index >= $scope.renovationStages.length)
                index = 0;
            $scope.renovationCurrentStage = $scope.renovationStages[index];
            $scope.calcRenoProgress();
            $scope.needToAssignTeam = $scope.renovationCurrentStage === $scope.defaultRenoStages[2];

            $scope.getStageImage();
        };

        $scope.previousStage = function () {
            var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
            index--;
            if (index < 0)
                index = $scope.renovationStages.length - 1;
            $scope.renovationCurrentStage = $scope.renovationStages[index];
            $scope.calcRenoProgress();
            $scope.needToAssignTeam = $scope.renovationCurrentStage === $scope.defaultRenoStages[2];

            $scope.getStageImage();
        };

        $scope.finalizeRenovation = function ($event) {
            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            console.log("the event is: ", $event);
            $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog, allTeams) {
                    $scope.allTeams = allTeams;
                    $scope.date = new Date();

                    $scope.renovation = {
                        team: "",
                        date: ""
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        $scope.FinalizeRenovationForm.$setDirty();
                        $scope.FinalizeRenovationForm.team.$setDirty();
                        if ($scope.FinalizeRenovationForm.$invalid) {
                            return;
                        }
                        // var tempDate = $scope.date;
                        // $scope.renovation.date = "" + tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getFullYear();
                        $scope.renovation.date = $scope.date;
                        //                        $scope.team = $scope.team._id;
                        $mdDialog.hide($scope.renovation);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/finalizeRenovationDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {
                    allTeams: $scope.allTeams
                }
            })
                .then(function (renovationAddedDetails) {
                    var reno = $scope.thisRenovation;
                    console.log("team we got is: ", renovationAddedDetails.team);
                    var addr = {
                        city: reno.addr.city,
                        street: reno.addr.street,
                        num: reno.addr.num
                    };
                    //TODO Update renovation date in the database
                    TeamService.assignToRenovation(renovationAddedDetails.team.name, renovationAddedDetails.date, addr)
                        .$promise.then(function (result) {
//						$scope.thisRenovation.date = new Date((renovationAddedDetails.date.getMonth() + 1) + "/" + renovationAddedDetails.date.getDate() + "/" + renovationAddedDetails.date.getYear());
                        $scope.thisRenovation.date = new Date(renovationAddedDetails.date);
                        $scope.thisRenovation.team = renovationAddedDetails.team;
                        $scope.getRenovationTeam($scope.thisRenovation.team.name);
//						$scope.enableEditStages();
                        $scope.nextStage();
//						$scope.disableEditStages();
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });
                    console.log("Dialog finished");

                }, function () {
                    console.log('Dialog Canceled.');
                });
        };


        /******Deleting Dialogs******/
        /*TODO: switch with the appropriate route for each delete of a variable*/
        $scope.deleteTask = function (task) {
            RenovationService.deleteTask($scope.thisRenovation.addr, task)
                .$promise.then(function (result) {
                var index = $scope.thisRenovation.tasks.indexOf(task);
                $scope.thisRenovation.tasks.splice(index, 1);
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };

        $scope.deleteTool = function (tool) {
            RenovationService.deleteTool($scope.thisRenovation.addr, tool)
                .$promise.then(function (result) {
                var index = $scope.thisRenovation.toolsNeeded.indexOf(tool);
                $scope.thisRenovation.toolsNeeded.splice(index, 1);
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };

        $scope.deletePinned = function (pinned) {
            RenovationService.deletePinned($scope.thisRenovation.addr, pinned)
                .$promise.then(function (result) {
                var index = $scope.thisRenovation.pinned.indexOf(pinned);
                $scope.thisRenovation.pinned.splice(index, 1);

            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };


        /******RSVP Functions and Variables******/
        /*Functions*/
        $scope.checkRSVP = function (email) {
            var reno = $scope.thisRenovation;
            for (var i in reno.rsvp) {
                if (reno.rsvp[i] === email) {
                    return true;
                }
            }
            return false;
        };

        $scope.toggleRSVP = function (email) {
            console.log("user: ", $scope.user);
            $scope.my_rsvp = true;
            RenovationService.rsvp($scope.thisRenovation.addr)
                .$promise.then(function (result) {
                $scope.my_rsvp = result.rsvp;
                if (result.rsvp)
                    $scope.thisRenovation.rsvp.push(email);
                else {
                    var index = $scope.thisRenovation.rsvp.indexOf(email);
                    $scope.thisRenovation.rsvp.splice(index, 1);
                }
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };

        /*Variables*/
        $scope.users_rsvp = $scope.thisRenovation.rsvp;
        $scope.my_rsvp = $scope.checkRSVP($scope.myUser.email);


        /******Task Utils******/
        $scope.taskFilter = false;

        $scope.changeTaskFilter = function () {
            $scope.taskFilter = !$scope.taskFilter;
        };

        $scope.taskDone = function (task) {
            RenovationService.doneTask($scope.thisRenovation.addr, task)
                .$promise.then(function (result) {
                task.done = "true";
                console.log("Task marked as done");
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };

        $scope.updateTaskAssignee = function (task, email) {
            RenovationService.assignTask($scope.thisRenovation.addr, task, email)
                .$promise.then(function (result) {
                console.log("New Assignee Assigned");
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };

        /******Reno Tools Utils******/
        $scope.toolsFilter = false;

        $scope.changeToolsFilter = function () {
            $scope.toolsFilter = !$scope.toolsFilter;
        };

        $scope.isFromShed = function (tool) {
            return tool.assigned === "shed";
        };

        $scope.bringTool = function (tool, assignee) {
            if (assignee === 'shed') {
                RenovationService.shedTool($scope.thisRenovation.addr, tool).$promise
                    .then(function (result) {
                        tool.being_brought = "true";
                        tool.assigned = assignee;
                        console.log("tool marked as being brought");
                    })
                    .catch(function (error) {
                        console.log("Error: ", error);
                    });

            } else {
                RenovationService.assignTool($scope.thisRenovation.addr, tool, assignee).$promise
                    .then(function (result) {
                        tool.being_brought = "true";
                        tool.assigned = assignee;
                        console.log("tool marked as being brought");
                    })
                    .catch(function (error) {
                        console.log("Error: ", error);
                    });
            }
        };

        $scope.dontBringTool = function (tool) {
            RenovationService.unassignTool($scope.thisRenovation.addr, tool)
                .$promise.then(function (result) {
                tool.being_brought = "false";
                tool.assigned = "";
                console.log("tool marked as not being brought");
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        };


        /******Information Dialogs******/
        /**
         * Invoke dialog showing the user details
         * @param $event
         * @param user {Object}
         */
        $scope.showUserDetails = function ($event, user) {
            // var isMobile = $mdMedia('sm') || $mdMedia('xs');
            //
            // var temp = angular.copy(user);
            // temp.role = UtilsService.translateRole(temp.role);
            //
            // $mdDialog.show({
            //     controller: function ($scope, $mdDialog, user) {
            //
            //         $scope.user = user;
            //         $scope.cancel = function () {
            //             $mdDialog.cancel();
            //         };
            //
            //         $scope.submit = function () {
            //             $mdDialog.hide();
            //         }
            //     },
            //     templateUrl: '/modules/dashboard/templates/dialogs/userDetails.html',
            //     parent: angular.element(document.body),
            //     targetEvent: $event,
            //     clickOutsideToClose: true,
            //     fullscreen: isMobile,
            //     locals: {
            //         user: temp
            //     }
            // });
        };

        $scope.isTeamAssigned = function (team) {
            if (team !== "") {
                return true;
            }
            return false;
        };

        $scope.assignMyselfToTask = function (task) {
            if (task.assigned_email !== "") {
                console.log("Trying to assign yourself while someone already assigned - shouldnt happen - error");
                return;
            }
            task.assigned_email = $scope.user.email;
        };

        $scope.removeMyselfFromTask = function (task) {
            if (task.assigned_email !== $scope.user.email) {
                console.log("Trying to remove yourself from task while you are not assigned to it - shouldnt happen - error");
                return;
            }
            task.assigned_email = "";
        };
    });
