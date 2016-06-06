angular.module('ProjectHands.dashboard')

.controller('DashboardController', function ($scope, DatabaseService, COLLECTIONS, $mdMedia, $mdDialog) {


	/*GRIDSTER SETTINGS - CAN BE DELETED ONCE GRIDSTER IS REMOVED*/
	/*******GRIDSTER SETTINGS START*******/
	$scope.editLayoutEnabled = false;

	/*Widgets properties*/
	$scope.widgets = [
		{
			title: 'Tasks Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Renovations Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Toolbox Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Team Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Calendar Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Profile Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        },
		{
			title: 'Chat Widget',
			settings: {
				sizeX: 2,
				sizeY: 2,
				minSizeX: 1,
				minSizeY: 1
			},
			active: false
        }
    ];

	$scope.gridsterOpts = {

		columns: 6, // the width of the grid, in columns
		pushing: false, // whether to push other items out of the way on move or resize
		floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
		swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
		width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
		colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
		rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
		margins: [10, 10], // the pixel distance between each widget
		outerMargin: true, // whether margins apply to outer edges of the grid
		isMobile: false, // stacks the grid items if true
		mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
		mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
		minColumns: 1, // the minimum columns the grid must have
		minRows: 2, // the minimum height of the grid, in rows
		maxRows: 100,
		defaultSizeX: 2, // the default width of a gridster item, if not specifed
		defaultSizeY: 1, // the default height of a gridster item, if not specified
		minSizeX: 2, // minimum column width of an item
		maxSizeX: null, // maximum column width of an item
		minSizeY: 3, // minumum row height of an item
		maxSizeY: null, // maximum row height of an item 
		resizable: {
			enabled: false,
			start: function (event, $element, widget) {}, // optional callback fired when resize is started,
			resize: function (event, $element, widget) {}, // optional callback fired when item is resized,
			stop: function (event, $element, widget) {} // optional callback fired when item is finished resizing
		},
		draggable: {
			enabled: false, // whether dragging items is supported
			//			handle: '.my-class', // optional selector for resize handle
			start: function (event, $element, widget) {}, // optional callback fired when drag is started,
			drag: function (event, $element, widget) {

			}, // optional callback fired when item is moved,
			stop: function (event, $element, widget) {} // optional callback fired when item is finished dragging
		}
	};

	/*Gridster Functions*/
	$scope.enableEditLayout = function () {
		$scope.editLayoutEnabled = true;
		$scope.gridsterOpts.draggable.enabled = true;
		$scope.gridsterOpts.resizable.enabled = true;
		$scope.gridsterOpts.pushing = true;
		$scope.gridsterOpts.floating = true;
		$scope.gridsterOpts.swapping = false;
	};
	$scope.disableEditLayout = function () {
		$scope.editLayoutEnabled = false;
		$scope.gridsterOpts.draggable.enabled = false;
		$scope.gridsterOpts.resizable.enabled = false;
		$scope.gridsterOpts.pushing = false;
		$scope.gridsterOpts.floating = false;
		$scope.gridsterOpts.swapping = true;
	};
	$scope.toggleIsMobile = function () {
		$scope.gridsterOpts.isMobile = !$scope.gridsterOpts.isMobile;
	};
	$scope.toggleMobileModeEnabled = function () {
		$scope.gridsterOpts.mobileModeEnabled = !$scope.gridsterOpts.mobileModeEnabled;
	};
	$scope.$on('gridster-mobile-changed', function (gridster) {});
	$scope.$on('gridster-draggable-changed', function (gridster) {});

	/*******GRIDSTER SETTINGS END*******/

	/*The team members of THIS user. might not need this*/
	$scope.teamMembers = [];
	/*All the teams of Project Hands*/
	$scope.allTeams = [];
	/*The Logged in User*/
	$scope.myUser = "";
	/*The logged user's team*/
	$scope.myTeam = "";
	/*All the renovations of project hands*/
	$scope.renovations = [];
	
	/*The first database query to run. getting Logged user, then his team, then all teams*/
	DatabaseService.query(COLLECTIONS.USERS, {
		email: $scope.user.email
	}).$promise.then(function (result) {
		$scope.myUser = result[0];
		$scope.getUserTeam($scope.myUser.email);
		$scope.getAllTeams();

	}).catch(function (error) {
		console.log("Error: ", error);
	});

	/*Function to get the specific user's team and then getting all the future renovations*/
	$scope.getUserTeam = function (email) {
		DatabaseService.query(COLLECTIONS.TEAMS, {
			members_email: email
		}).$promise.then(function (result) {
			$scope.myTeam = result[0];
			for (var i in $scope.myTeam.members_email) {
				$scope.getTeamMember($scope.myTeam.members_email[i]);
			}
			$scope.getRenovations();
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	
	/*Function to get a team member by his email address*/
	$scope.getTeamMember = function (memberEmail) {
		DatabaseService.query(COLLECTIONS.USERS, {
			email: memberEmail
		}).$promise.then(function (result) {
			$scope.teamMembers.push(result[0]);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	/*Function to get all renovations of Project Hands*/
	$scope.getRenovations = function () {
		DatabaseService.query(COLLECTIONS.RENOVATIONS, {}).$promise.then(function (result) {
			$scope.renovations = result;
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	/*Dialog to add a renovation by Address*/
	$scope.addRenovation = function ($event) {
		var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
		$mdDialog.show({
				controller: function ($scope, $mdToast, $mdDialog) {
					$scope.today = new Date();
					$scope.renovation = {
						addr: {
							city: "",
							street: "",
							num: ""
						},
						created: "" + $scope.today.getDate() + "/" + ($scope.today.getMonth() + 1) + "/" + $scope.today.getFullYear(),
						updated: "" + $scope.today.getDate() + "/" + ($scope.today.getMonth() + 1) + "/" + $scope.today.getFullYear(),
						date: "",
						tasks: [],
						"chat_id": "",
						"team_id": "",
						"pinned": [],
						"toolsNeeded": [],
						"renovation_stages": [
                            "ביקור ראשוני בדירה לבדיקת התאמה",
                            "הוחלט לשפץ, יש צורך לעדכן עובד סוציאלי",
                            "עובד סוציאלי עודכן, יש צורך לשבץ צוות",
                            "על ראש הצוות להגיע לביקור לצרכי תכנון",
                            "שלב ההכנות לשיפוץ",
                            "הדירה בשיפוץ",
                            "הסתיים השיפוץ"
                        ],
						"current_stage": "ביקור ראשוני בדירה לבדיקת התאמה"
					};
					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.submit = function () {
						if ($scope.AddRenovationForm.$invalid) {
							return;
						}
						$mdDialog.hide($scope.renovation);
					};
				},
				templateUrl: '/modules/dashboard/templates/dialogs/addRenovationDialog.html',
				targetEvent: $event,
				clickOutsideToClose: false,
				fullscreen: useFullScreen,
				locals: {}
			})
			.then(function (newReno) {
				DatabaseService.insert(COLLECTIONS.RENOVATIONS, newReno)
					.$promise.then(function (result) {}).catch(function (error) {
						console.log("Error: ", error);
					});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};

	/*Function to get all teams of Project Hands*/
	$scope.getAllTeams = function () {
		DatabaseService.query(COLLECTIONS.TEAMS, {})
			.$promise.then(function (result) {
				$scope.allTeams = [];
				for (var i = 0; i < result.length; i++) {
					$scope.allTeams.push(result[i]);
				}
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	};

	//TODO: need to find a way to only take Unassigned users.
	/*Function to get all the users of Project Hands*/
	$scope.getAllUsers = function () {
		DatabaseService.query(COLLECTIONS.USERS, {})
			.$promise.then(function (result) {
				$scope.allUsers = [];
				for (var i = 0; i < result.length; i++) {
					$scope.allUsers.push(result[i]);
				}
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	}

	/*Dialog to add a Team to Project Hands*/
	$scope.addTeam = function ($event) {
		var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
		$mdDialog.show({
				controller: function ($scope, $mdToast, $mdDialog) {
					$scope.allUsers = [];

					DatabaseService.query(COLLECTIONS.USERS, {})
						.$promise.then(function (result) {
							$scope.allUsers = [];
							for (var i = 0; i < result.length; i++) {
								$scope.allUsers.push(result[i]);
							}
						}).catch(function (error) {
							console.log("Error: ", error);
							$scope.cancel();
						});

					$scope.manager = "";
					$scope.team = {
						name: "",
						manager_email: "",
						members_email: [],
						_id: ""
					};

					$scope.checkedUsers = [];

					$scope.toggle = function (item, list) {
						var idx = list.indexOf(item);
						if (idx > -1) {
							list.splice(idx, 1);
						} else {
							list.push(item);
						}
					};

					$scope.exists = function (item, list) {
						return list.indexOf(item) > -1;
					};

					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.submit = function () {
						if ($scope.AddTeamForm.$invalid) {
							return;
						}
						for (var i = 0; i < $scope.checkedUsers.length; i++) {
							$scope.team.members_email.push($scope.checkedUsers[i].email);
						}
						$scope.team.manager_email = $scope.manager.email;
						$scope.team._id = "team_" + $scope.manager._id;
						$mdDialog.hide($scope.team);
					};
				},
				templateUrl: '/modules/dashboard/templates/dialogs/addTeamDialog.html',
				targetEvent: $event,
				clickOutsideToClose: false,
				fullscreen: useFullScreen,
				locals: {}
			})
			.then(function (newTeam) {
				DatabaseService.insert(COLLECTIONS.TEAMS, newTeam)
					.$promise.then(function (result) {

						$scope.allTeams.push(newTeam);
					}).catch(function (error) {
						console.log("Error: ", error);
					});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};

	/*Dialog to Delete team. will do so ONLY if you type the exact name of the team*/
	$scope.deleteTeam = function ($event, team) {
		var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
		$mdDialog.show({
				controller: function ($scope, $mdToast, $mdDialog) {
					console.log("Trying to delete ", team._id);
					$scope.team_name = team.name;
					$scope.typed_name = "";
					$scope.checkedUsers = [];

					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.submit = function () {
						if ($scope.DeleteTeamForm.$invalid) {
							console.log("invalid form");
							return;
						}
						if ($scope.typed_name !== $scope.team_name) {
							console.log("Names do not match!");
							return;
						}
						$mdDialog.hide(team);
					};
				},
				templateUrl: '/modules/dashboard/templates/dialogs/deleteTeamDialog.html',
				targetEvent: $event,
				clickOutsideToClose: false,
				fullscreen: useFullScreen,
				locals: {}
			})
			.then(function (deleted_team) {
				DatabaseService.remove(
					COLLECTIONS.TEAMS, {
						_id: deleted_team._id
					}
				).$promise.then(function (result) {
					var index = $scope.allTeams.indexOf(deleted_team);
					$scope.allTeams.splice(index, 1);

				}).catch(function (error) {
					console.log("Error: ", error);
				});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};

});
