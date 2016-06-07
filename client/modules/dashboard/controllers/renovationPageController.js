/**
 * Created by DDraiman1990 on May 2016.
 */
angular.module('ProjectHands.dashboard')

.controller('RenovationPageController', function ($scope, $stateParams, $mdSidenav, $mdMedia, $mdDialog, DatabaseService, COLLECTIONS) {

	/******Getters******/
	$scope.getRenovation = function (city, street, num) {
		for (var reno in $scope.renovations) {
			var renovation = $scope.renovations[reno];
			if (renovation.addr.city == city && renovation.addr.street == street && renovation.addr.num == num) {
				$scope.thisRenovation = renovation;
				$scope.getRenovationTeam($scope.thisRenovation.team_id);
				return;
			}
		}
		$scope.renovationNotFound = true;

	};

	$scope.getRenovationTeam = function (team_id) {
		//		var team_id = $scope.thisRenovation.team_id;
		$scope.renovationMembers = [];
		DatabaseService.query(COLLECTIONS.TEAMS, {
			_id: team_id
		}).$promise.then(function (result) {
			$scope.renovationTeam = result[0];
			var team = $scope.renovationTeam;
			for (var i in team.members) {
				$scope.getMemberByEmail(team.members[i]);
			}

		}).catch(function (error) {
			console.log("Error: ", error);
		});

	};

	$scope.getMemberByEmail = function (email) {
		DatabaseService.query(COLLECTIONS.USERS, {
			email: email
		}).$promise.then(function (result) {
			$scope.renovationMembers.push(result[0]);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};


	/******Variables Declarations******/
	$scope.thisRenovation = "";
	$scope.renovationNotFound = false;
	$scope.renovationMembers = [];
	$scope.renovationTeam = "";
	$scope.editMessagesMode = false;
	$scope.editTasksMode = false;
	$scope.editToolsMode = false;
	$scope.needToAssignTeam = ($scope.renovationCurrentStage === "עובד סוציאלי עודכן, יש צורך לשבץ צוות");
	$scope.editStagesMode = false;
	$scope.lastStage = "";
	$scope.minDate = new Date();


	/******First call to get Renovation before initializing more variables******/
	$scope.getRenovation($stateParams.city, $stateParams.street, $stateParams.num);


	/******Initialize more Variables******/
	$scope.renovationChatRoom = [$scope.thisRenovation.chat_id];
	$scope.renovationStages = $scope.thisRenovation.renovation_stages;
	$scope.renovationCurrentStage = $scope.thisRenovation.current_stage;
	$scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));


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


	/******Misc Functions******/
	$scope.calcRenoProgress = function () {
		$scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));
	};


	/******Adding Dialogs******/
	$scope.addTask = function ($event) {
		var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
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
				//Check for duplicates in tasks
				for (var i in $scope.thisRenovation.tasks) {
					if ($scope.thisRenovation.tasks[i].name === newTask.name) {
						$scope.constructionToast('top right');
						throw new Error("Task Title already exists. Please choose a different title");
					}
				}
				var reno = $scope.thisRenovation;
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
				var reno = $scope.thisRenovation;
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
				var reno = $scope.thisRenovation;
				DatabaseService.update(
						COLLECTIONS.RENOVATIONS, {
							addr: {
								city: reno.addr.city,
								street: reno.addr.street,
								num: reno.addr.num
							}
						}, {
							$push: {
								"renovation_stages": {
									$each: [newStage.title],
									$position: push_index
								}
							}
						}, {}
					)
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
				//Check for duplicates in tools
				for (var i in $scope.thisRenovation.toolsNeeded) {
					if ($scope.thisRenovation.toolsNeeded[i].name === newTool.name) {
						$scope.constructionToast('top right');
						throw new Error("Tool Name already exists. Please choose a different name");
					}
				}
				var reno = $scope.thisRenovation;
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
						$scope.thisRenovation.toolsNeeded.push(newTool);
					}).catch(function (error) {
						console.log("Error: ", error);
					});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};


	/******Stages Editing functions******/
	$scope.enableEditStages = function () {
		$scope.editStagesMode = true;
		$scope.lastStage = $scope.renovationCurrentStage;
	};

	$scope.disableEditStages = function () {
		$scope.editStagesMode = false;
		if ($scope.lastStage != $scope.renovationCurrentStage) {
			var reno = $scope.thisRenovation;
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
				}, {}
			).$promise.then(function (result) {}).catch(function (error) {
				console.log("Error: ", error);
				//if there was a problem, go back to the last stage that was valid
				$scope.renovationCurrentStage = $scope.lastStage;
			});
			if ($scope.renovationCurrentStage === "עובד סוציאלי עודכן, יש צורך לשבץ צוות") {
				$scope.needToAssignTeam = true;
			} else {
				$scope.needToAssignTeam = false;
			}
		}

	};

	$scope.nextStage = function () {
		var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
		index++;
		if (index >= $scope.renovationStages.length)
			index = 0;
		$scope.renovationCurrentStage = $scope.renovationStages[index];
		$scope.calcRenoProgress();
		if ($scope.renovationCurrentStage === "עובד סוציאלי עודכן, יש צורך לשבץ צוות") {
			$scope.needToAssignTeam = true;
		} else {
			$scope.needToAssignTeam = false;
		}

	};

	$scope.previousStage = function () {
		var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
		index--;
		if (index < 0)
			index = $scope.renovationStages.length - 1;
		$scope.renovationCurrentStage = $scope.renovationStages[index];
		$scope.calcRenoProgress();
		if ($scope.renovationCurrentStage === "עובד סוציאלי עודכן, יש צורך לשבץ צוות") {
			$scope.needToAssignTeam = true;
		} else {
			$scope.needToAssignTeam = false;
		}

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
						date: "",
					};
					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.submit = function () {
						if ($scope.FinalizeRenovationForm.$invalid) {
							return;
						}
						var tempDate = $scope.date;
						$scope.renovation.date = "" + tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getFullYear();
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
				DatabaseService.update(
						COLLECTIONS.RENOVATIONS, {
							addr: {
								city: reno.addr.city,
								street: reno.addr.street,
								num: reno.addr.num
							}
						}, {
							$set: {
								"team_id": renovationAddedDetails.team._id,
								"date": renovationAddedDetails.date
							}
						}, {}
					)
					.$promise.then(function (result) {
						$scope.thisRenovation.date = renovationAddedDetails.date;
						$scope.thisRenovation.team_id = renovationAddedDetails.team._id;
						$scope.getRenovationTeam($scope.thisRenovation.team_id);
						$scope.nextStage();
					}).catch(function (error) {
						console.log("Error: ", error);
					});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};


	/******Deleting Dialogs******/
	$scope.deleteTask = function (task) {
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				}
			}, {
				$pull: {
					"tasks": {
						'name': task.name
					}
				}
			}, {}
		).$promise.then(function (result) {
			var index = $scope.thisRenovation.tasks.indexOf(task);
			$scope.thisRenovation.tasks.splice(index, 1);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	$scope.deleteTool = function (tool) {
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				}
			}, {
				$pull: {
					"toolsNeeded": {
						'name': tool.name
					}
				}
			}, {}
		).$promise.then(function (result) {
			var index = $scope.thisRenovation.toolsNeeded.indexOf(tool);
			$scope.thisRenovation.toolsNeeded.splice(index, 1);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	$scope.deletePinned = function (pinned) {
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				}
			}, {
				$pull: {
					"pinned": {
						'title': pinned.title
					}
				}
			}, {}
		).$promise.then(function (result) {
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
	}

	$scope.confirmRSVP = function (email) {
		$scope.my_rsvp = true;
		var reno = $scope.thisRenovation;
		DatabaseService.update(
				COLLECTIONS.RENOVATIONS, {
					addr: {
						city: reno.addr.city,
						street: reno.addr.street,
						num: reno.addr.num
					}
				}, {
					$push: {
						"rsvp": email
					}
				}, {}
			)
			.$promise.then(function (result) {
				$scope.thisRenovation.rsvp.push(email);
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	}

	$scope.declineRSVP = function (email) {
		var reno = $scope.thisRenovation;
		$scope.my_rsvp = false;
		DatabaseService.update(
				COLLECTIONS.RENOVATIONS, {
					addr: {
						city: reno.addr.city,
						street: reno.addr.street,
						num: reno.addr.num
					}
				}, {
					$pull: {
						"rsvp": email
					}
				}, {}
			)
			.$promise.then(function (result) {
			console.log("removed " + email);
				var index = $scope.thisRenovation.rsvp.indexOf(email);
				$scope.thisRenovation.rsvp.splice(index, 1);
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	}
	
	/*Variables*/
	$scope.users_rsvp = $scope.thisRenovation.rsvp;
	$scope.my_rsvp = $scope.checkRSVP($scope.myUser.email);
	
	
});
