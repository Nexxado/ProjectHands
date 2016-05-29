angular.module('ProjectHands.dashboard')

.controller('RenovationPageController', function ($scope, $stateParams, $mdSidenav, $mdMedia, $mdDialog, DatabaseService, COLLECTIONS) {


    console.log("Testing to see if params arrive safely: ", $stateParams.city, $stateParams.street, $stateParams.num);
    $scope.thisRenovation = "";
    $scope.renovationNotFound = false;
    console.log("Renovations are: ", $scope.renovations);
    console.log("my id is: ", $scope.myUser._id);

    $scope.getRenovation = function (city, street, num) {
        console.log("Searching for renovation");
        console.log($scope.renovations);
        for (var reno in $scope.renovations) {
            var renovation = $scope.renovations[reno];
            if (renovation.addr.city == city && renovation.addr.street == street && renovation.addr.num == num) {
                $scope.thisRenovation = renovation;
                console.log("Renovation found in User Reno array");
                return;
            }
        }
        console.log("Reno wasnt found!");
        $scope.renovationNotFound = true;

    };

    $scope.getRenovation($stateParams.city, $stateParams.street, $stateParams.num);

    $scope.renovationChatRoom = [$scope.thisRenovation.chat_id];

    $scope.renovationStages = $scope.thisRenovation.renovation_stages;
    $scope.renovationCurrentStage = $scope.thisRenovation.current_stage;
    $scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));

    console.log("Renovation progress is: ", $scope.renovationProgress);
    console.log("num of stages is: ", $scope.renovationStages.length);

    $scope.getMemberByID = function (id) {
        for (var i in $scope.teamMembers) {
            var teamMember = $scope.teamMembers[i];
            if (teamMember._id == id)
                return teamMember;
        }
        return "User not found!";
    };


    $scope.editMessagesMode = false;
    $scope.editTasksMode = false;


    $scope.editMessages = function () {
        $scope.editMessagesMode = !$scope.editMessagesMode;
    };

    $scope.editTasks = function () {
        $scope.editTasksMode = !$scope.editTasksMode;
    };

    $scope.openLeftMenu = function () {
        console.log("click aa");
        $mdSidenav('left').toggle().then(function () {
            console.log("sidenav opened");
        });
    };

    $scope.addTask = function ($event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        console.log("the event is: ", $event);
        $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
                    $scope.task = {
                        name: "",
                        description: "",
                        assigned_id: "",
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
                var reno = $scope.thisRenovation;
                console.log(reno, $scope.thisRenovation);
                DatabaseService.update(
                        COLLECTIONS.RENOVATIONS, {
                            addr: {
                                city: reno.addr.city,
                                street: reno.addr.street,
                                num: reno.addr.num
                            }
                        }, {
                            $push: {
                                "tasks": newTask
                            }
                        }, {}
                    )
                    .$promise.then(function (result) {
                        console.log("The result amazingly is: ", result);
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
        console.log("the event is: ", $event);
        $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
                    $scope.today = new Date();
                    $scope.pinned = {
                        title: "",
                        description: "",
                        added_date: "" + $scope.today.getDate() + "/" + ($scope.today.getMonth() + 1) + "/" + $scope.today.getFullYear()
                    };
                    console.log($scope.pinned.added_date);
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
                var reno = $scope.thisRenovation;
                console.log(reno, $scope.thisRenovation);
                DatabaseService.update(
                        COLLECTIONS.RENOVATIONS, {
                            addr: {
                                city: reno.addr.city,
                                street: reno.addr.street,
                                num: reno.addr.num
                            }
                        }, {
                            $push: {
                                "pinned": newPinned
                            }
                        }, {}
                    )
                    .$promise.then(function (result) {
                        console.log("The result amazingly is: ", result);
                        $scope.thisRenovation.pinned.push(newPinned);
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
        console.log("the event is: ", $event);
        $mdDialog.show({
                controller: function ($scope, $mdToast, $mdDialog) {
                    $scope.tool = {
                        name: "",
                        quantity: "",
                        comment: ""
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        if ($scope.AddToolForm.$invalid) {
                            return;
                        }
                        if ($scope.tool.quantity <= 0 || $scope.tool.quantity === "")
                            $scope.tool.quantity = 1;
                        $mdDialog.hide($scope.tool);
                    };
                },
                templateUrl: '/modules/dashboard/templates/dialogs/addToolDialog.html',
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: {}
            })
            .then(function (newTool) {
                var reno = $scope.thisRenovation;
                console.log(reno, $scope.thisRenovation);
                DatabaseService.update(
                        COLLECTIONS.RENOVATIONS, {
                            addr: {
                                city: reno.addr.city,
                                street: reno.addr.street,
                                num: reno.addr.num
                            }
                        }, {
                            $push: {
                                "toolsNeeded": newTool
                            }
                        }, {}
                    )
                    .$promise.then(function (result) {
                        console.log("The result amazingly is: ", result);
                        $scope.thisRenovation.toolsNeeded.push(newTool);
                    }).catch(function (error) {
                        console.log("Error: ", error);
                    });
                console.log("Dialog finished");

            }, function () {
                console.log('Dialog Canceled.');
            });
    };

    $scope.editStagesMode = false;
    $scope.lastStage = "";
    $scope.enableEditStages = function () {
        $scope.editStagesMode = true;
        $scope.lastStage = $scope.renovationCurrentStage;
    };

    $scope.disableEditStages = function () {
        $scope.editStagesMode = false;
        if ($scope.lastStage != $scope.renovationCurrentStage) {
            var reno = $scope.thisRenovation;
            console.log("IT WAS CHANGED");
            console.log("It was: ", $scope.lastStage);
            console.log("It is now: ", $scope.renovationCurrentStage);
            DatabaseService.update(
                COLLECTIONS.RENOVATIONS, {
                    addr: {
                        city: reno.addr.city,
                        street: reno.addr.street,
                        num: reno.addr.num
                    }
                }, {
                    $set: {
                        "current_stage": $scope.renovationCurrentStage
                    }
                }
            ).$promise.then(function (result) {
                console.log("The result is: ", result);
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        }
    };

    $scope.nextStage = function () {
        var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
        index++;
        if (index >= $scope.renovationStages.length)
            index = 0;
        $scope.renovationCurrentStage = $scope.renovationStages[index];
    };

    $scope.previousStage = function () {
        var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
        index--;
        if (index < 0)
            index = $scope.renovationStages.length - 1;
        $scope.renovationCurrentStage = $scope.renovationStages[index];
    };

});
