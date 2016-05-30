angular.module('ProjectHands.dashboard')

.controller('DashboardController', function ($scope, DatabaseService, COLLECTIONS, $mdMedia, $mdDialog) {

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

	/*Grister Settings*/
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


	$scope.teamMembers = [];
	$scope.allTeams = [];

	DatabaseService.query(COLLECTIONS.USERS, {
		email: $scope.user.email
	}).$promise.then(function (result) {
		console.log("My email is: ", $scope.user.email);
		$scope.myUser = result[0];
		$scope.getUserTeam($scope.myUser.email);
		console.log("my ID is: ", $scope.myUser._id);
		//        $scope.getUserTeam('111111111'); //FIXME Delete and uncomment above line
		$scope.getAllTeams();

	}).catch(function (error) {
		console.log("Error: ", error);
	});
	/*Logged in User*/
	$scope.myUser = "";


	$scope.getUserTeam = function (email) {
		DatabaseService.query(COLLECTIONS.TEAMS, {
			members_email: email
		}).$promise.then(function (result) {
			//			console.log("getUserTeam Result: ", result);
			$scope.myTeam = result[0];
			//			$scope.getTeamMember($scope.myTeam.manager_email);
			//			console.log("mamanger ", $scope.myTeam.manager_id);
			for (var i in $scope.myTeam.members_email) {
				$scope.getTeamMember($scope.myTeam.members_email[i]);
			}
			$scope.getRenovations();
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	$scope.myTeam = "";

	$scope.getTeamMember = function (memberEmail) {
		DatabaseService.query(COLLECTIONS.USERS, {
			email: memberEmail
		}).$promise.then(function (result) {
			//			console.log("MemberID Result: ", result[0]);
			$scope.teamMembers.push(result[0]);
			//			console.log($scope.teamMembers);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

	$scope.renovations = [];

	$scope.getRenovations = function () {
		DatabaseService.query(COLLECTIONS.RENOVATIONS, {}).$promise.then(function (result) {
			$scope.renovations = result;
			console.log($scope.renovations);
		}).catch(function (error) {
			console.log("Error: ", error);
		});
	};

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
					.$promise.then(function (result) {
						console.log("The result amazingly is: ", result);
					}).catch(function (error) {
						console.log("Error: ", error);
					});
				console.log("Dialog finished");

			}, function () {
				console.log('Dialog Canceled.');
			});
	};

	//	$scope.allTeams = [];

	$scope.getAllTeams = function () {
		DatabaseService.query(COLLECTIONS.TEAMS, {})
			.$promise.then(function (result) {
				console.log("Team query result is: ", result);
				$scope.allTeams = [];
				for(var i = 0; i < result.length; i++) {
					$scope.allTeams.push(result[i]);
				}
				console.log("teams are: ", $scope.allTeams);
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	};
});
