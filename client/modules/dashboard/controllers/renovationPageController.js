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

    $scope.getMemberByID = function (id) {
        for (var i in $scope.teamMembers) {
            var teamMember = $scope.teamMembers[i];
            if (teamMember._id == id)
                return teamMember;
        }
        return "User not found!";
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

});
