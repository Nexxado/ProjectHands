/**
 * Created by DDraiman1990 on May 2016.
 */
angular.module('ProjectHands.dashboard')

.controller('RenovationPageController', function ($scope, $stateParams, $mdSidenav, $mdMedia, $mdDialog, DatabaseService, COLLECTIONS, UtilsService) {
	
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
		"/assets/img/renovation-page/extra-stage.png",
	]
	
	/******Getters******/
	
	$scope.checkMemberFound = function(name){
		if(name !== null)
			return true;
		return false;
	}
	
	$scope.checkTaskDone = function(done){
		if(done === "true")
			return true;
		return false;
	}
	
	$scope.checkToolBeingBrought = function(brought){
		if(brought === "true")
			return true;
		return false;
	}
	
	$scope.getMemberName = function(email){
		for(var i in $scope.renovationMembers){
			if($scope.renovationMembers[i].email === email)
				return $scope.renovationMembers[i].name;
		}
		return null;
	}
	
	/*TODO: switch with the appropriate route*/
	$scope.getRenovationTeam = function (team_id) {
		DatabaseService.query(COLLECTIONS.TEAMS, {
			_id: team_id
		}).$promise.then(function (result) {
			$scope.renovationTeam = result[0];
			$scope.getRenovationMembers($scope.renovationTeam);
			
		}).catch(function (error) {
			console.log("Error: ", error);
		});

	};
	
	/*TODO: switch with the appropriate route*/
	$scope.getRenovationMembers = function (team) {
		$scope.renovationMembers = [];
		console.log("getting members for ", team.name);
		for(var i in team.members){
			$scope.pushMemberByMail(team.members[i]);
		}
		$scope.initializeVariables();

	};
	
	/*TODO: switch with the appropriate route*/
	$scope.pushMemberByMail = function (email) {
		DatabaseService.query(COLLECTIONS.USERS, {
			email: email
		}).$promise.then(function (result) {
			$scope.renovationMembers.push(result[0]);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};


	/*TODO: switch with the appropriate route*/
	DatabaseService.query(COLLECTIONS.RENOVATIONS, {
			addr: {
				city: $stateParams.city,
				street: $stateParams.street,
				num: $stateParams.num
		}
		}).$promise.then(function (result) {
                $scope.thisRenovation = result[0];
				$scope.getRenovationTeam($scope.thisRenovation.team_id);
            }).catch(function (error) {
                console.log("Error: ", error);
     });
	
	
	
	/******Initialize more Variables******/
	$scope.initializeVariables = function(){
		$scope.minDate = new Date();
		$scope.renovationChatRoom = [$scope.thisRenovation.chat_id];
		$scope.renovationStages = $scope.thisRenovation.renovation_stages;
		$scope.renovationCurrentStage = $scope.thisRenovation.current_stage;
		$scope.needToAssignTeam = ($scope.renovationCurrentStage === $scope.defaultRenoStages[2]);
		$scope.renovationProgress = Math.floor((100 / ($scope.renovationStages.length)) * ($scope.renovationStages.indexOf($scope.renovationCurrentStage) + 1));
		$scope.getStageImage();
	}

	$scope.getStageImage = function(){
		console.log("Getting stage image");
		console.log("image was: ", $scope.renovationStageImage);
		var index = $scope.defaultRenoStages.indexOf($scope.renovationCurrentStage);
		if(index === -1)
			index = $scope.defaultStagesImages.length - 1;
		$scope.renovationStageImage = $scope.defaultStagesImages[index];
		console.log("image is now: ", $scope.renovationStageImage);
	}

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
				//Check for duplicates in tasks
				var reno = $scope.thisRenovation;
				DatabaseService.update(
						COLLECTIONS.RENOVATIONS, {
							addr: {
								city: reno.addr.city,
								street: reno.addr.street,
								num: reno.addr.num
							},
							"pinned.title": pinneds[0].title
						}, {
							$set: {
								"pinned.$.title": pinneds[1].title,
								"pinned.$.description": pinneds[1].description,
								"pinned.$.added_date": pinneds[1].added_date,
							}
						}, {}
					)
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
				//Check for duplicates in tasks
				var reno = $scope.thisRenovation;
				DatabaseService.update(
						COLLECTIONS.RENOVATIONS, {
							addr: {
								city: reno.addr.city,
								street: reno.addr.street,
								num: reno.addr.num
							},
							"tasks.name": tasks[0].name
						}, {
							$set: {
								"tasks.$.name": tasks[1].name,
								"tasks.$.description": tasks[1].description,
								"tasks.$.assigned_email": tasks[1].assigned_email,
								"tasks.$.done": tasks[1].done
							}
						}, {}
					)
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
		if ($scope.renovationCurrentStage === $scope.defaultRenoStages[2]) {
			$scope.needToAssignTeam = true;
		} else {
			$scope.needToAssignTeam = false;
		}
		
		$scope.getStageImage();
	};

	$scope.previousStage = function () {
		var index = $scope.renovationStages.indexOf($scope.renovationCurrentStage);
		index--;
		if (index < 0)
			index = $scope.renovationStages.length - 1;
		$scope.renovationCurrentStage = $scope.renovationStages[index];
		$scope.calcRenoProgress();
		if ($scope.renovationCurrentStage === $scope.defaultRenoStages[2]) {
			$scope.needToAssignTeam = true;
		} else {
			$scope.needToAssignTeam = false;
		}
		
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
	/*TODO: switch with the appropriate route for each delete of a variable*/
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
		console.log("user: ", $scope.user);
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
	
	
	/******Task Utils******/
	$scope.taskFilter = false;
	
	$scope.changeTaskFilter = function(){
		$scope.taskFilter = !$scope.taskFilter;
	}
	
	$scope.taskDone = function(task){
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				},
				"tasks.name": task.name
			}, {
				$set: {
					"tasks.$.done": "true"
				}
			}, {}
		)
		.$promise.then(function (result) {
			task.done = "true";
			console.log("Task marked as done");
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};
	
	$scope.updateTaskAssignee = function(task, email){
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				},
				"tasks.name": task.name
			}, {
				$set: {
					"tasks.$.assigned_email": email
				}
			}, {}
		)
		.$promise.then(function (result) {
			console.log("New Assignee Assigned");
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};
	
	/******Reno Tools Utils******/
	$scope.toolsFilter = false;
	
	$scope.changeToolsFilter = function(){
		$scope.toolsFilter = !$scope.toolsFilter;
	}
	
	$scope.isFromShed = function(tool){
		if(tool.assigned === "shed"){
			return true;
		}
		return false;
	}
	
	$scope.bringTool = function(tool, email){
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				},
				"toolsNeeded.name": tool.name
			}, {
				$set: {
					"toolsNeeded.$.being_brought": "true",
					"toolsNeeded.$.assigned": email
				}
			}, {}
		)
		.$promise.then(function (result) {
			tool.being_brought = "true";
			tool.assigned = email; 
			console.log("tool marked as being brought");
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};
	
	$scope.dontBringTool = function(tool){
		var reno = $scope.thisRenovation;
		DatabaseService.update(
			COLLECTIONS.RENOVATIONS, {
				addr: {
					city: reno.addr.city,
					street: reno.addr.street,
					num: reno.addr.num
				},
				"toolsNeeded.name": tool.name
			}, {
				$set: {
					"toolsNeeded.$.being_brought": "false",
					"toolsNeeded.$.assigned": ""
				}
			}, {}
		)
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
            var isMobile = $mdMedia('sm') || $mdMedia('xs');

            var temp = angular.copy(user);
            temp.role = UtilsService.translateRole(temp.role);

            $mdDialog.show({
                controller: function ($scope, $mdDialog, user) {

                    $scope.user = user;
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.submit = function () {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/modules/dashboard/templates/dialogs/userDetails.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: isMobile,
                locals: {
                    user: temp
                }
            });
        };
	

	
});
