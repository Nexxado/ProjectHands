angular.module('ProjectHands.dashboard')

.controller('DashboardController', function ($scope) {

    $scope.editLayoutEnabled = false;
    
    /*Widgets properties*/
    $scope.widgets = [
        {
            title: 'Tasks Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Renovations Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Toolbox Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Team Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Calendar Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Profile Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
            },
            active: false
        },
        {
            title: 'Chat Widget',
            settings: {
                sizeX: 2,
                sizeY: 2,
                minSizeX: 2,
                minSizeY: 2
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
			start: function (event, $element, widget) {
			}, // optional callback fired when resize is started,
			resize: function (event, $element, widget) {
			}, // optional callback fired when item is resized,
			stop: function (event, $element, widget) {
				} // optional callback fired when item is finished resizing
		},
		draggable: {
			enabled: false, // whether dragging items is supported
//			handle: '.my-class', // optional selector for resize handle
			start: function (event, $element, widget) {
			}, // optional callback fired when drag is started,
			drag: function (event, $element, widget) {

			}, // optional callback fired when item is moved,
			stop: function (event, $element, widget) {
				} // optional callback fired when item is finished dragging
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
	$scope.$on('gridster-mobile-changed', function (gridster) {
	});
	$scope.$on('gridster-draggable-changed', function (gridster) {
	});
    
    /* Mock Objects creations: */
    $scope.myID = "123456197";
    
    $scope.rooms = ["General", "Reno1", "Reno2"];
    $scope.tools = [
        {
            name: "פטיש",
            quantity: 2,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "מקדחה",
            quantity: 1,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "ברגים",
            quantity: 1230,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "מסור",
            quantity: 3,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "קאטר",
            quantity: 1,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "דבק",
            quantity: 12,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "חול",
            quantity: 4,
            comment: "peter piper picked a pack of pickled peppers"
		},
        {
            name: "מברג",
            quantity: 2,
            comment: "peter piper picked a pack of pickled peppers"
		}
	];

    $scope.userType = ["Admin", "Team-Leader", "Volunteer"];

    $scope.users = [
        {
            id: "123456789",
            name: "דוד מוזס",
            type: $scope.userType[0],
            joined_date: new Date(2000, 01, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "חטיבת הנחנחים 5, שפרעם",
            phone: "057-7896651",
            aboutMe: "אני גבר טילים",
            totalRenovations: 50,
            tools: [

            ]
        },
        {
            id: "324465778",
            name: "עכוז מלוז",
            type: $scope.userType[1],
            joined_date: new Date(2001, 04, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "ילד המדורות 5, הרצליה קיפוח",
            phone: "054-1234567",
            aboutMe: "אני כבש משו משו",
            totalRenovations: 41,
            tools: [
                {
                    name: "דבק",
                    quantity: 12,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "חול",
                    quantity: 4,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "מברג",
                    quantity: 2,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
        {
            id: "457894653",
            name: "שלב בן יפונה",
            type: $scope.userType[1],
            joined_date: new Date(2001, 05, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "ילד טוב 1, ירושלים",
            phone: "051-7894563",
            aboutMe: "אני פרח השכונות",
            totalRenovations: 76,
            tools: [
                {
                    name: "מסור",
                    quantity: 3,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "קאטר",
                    quantity: 1,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
        {
            id: "784569885",
            name: "קירבי הדרדס",
            type: $scope.userType[2],
            joined_date: new Date(2001, 03, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "אקי פקי 4, אי שיקידיץ",
            phone: "058-1237895",
            aboutMe: "כלב טוב",
            totalRenovations: 98,
            tools: [
                {
                    name: "פטיש",
                    quantity: 2,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "מקדחה",
                    quantity: 1,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
        {
            id: "123456197",
            name: "חארבו דרבו",
            type: $scope.userType[2],
            joined_date: new Date(2001, 02, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "מי ימלל 9, גבורות ישראל",
            phone: "059-1472586",
            aboutMe: "אין ספק שאתה צודק",
            totalRenovations: 47,
            tools: [
                {
                    name: "פטיש",
                    quantity: 2,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "מקדחה",
                    quantity: 1,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
        {
            id: "567931643",
            name: "ציגלה ביגלה",
            type: $scope.userType[2],
            joined_date: new Date(2001, 01, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "הרמבם 8, ראשון לציון",
            phone: "056-1232589",
            aboutMe: "אני מלך מלכי הקופים",
            totalRenovations: 12,
            tools: [
                {
                    name: "פטיש",
                    quantity: 2,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "מקדחה",
                    quantity: 1,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
        {
            id: "784659132",
            name: "שילקי מילקי",
            type: $scope.userType[2],
            joined_date: new Date(2001, 01, 01),
            avatar: "http://icons.iconarchive.com/icons/mattahan/ultrabuuf/256/Comics-Mask-icon.png",
            address: "שמשוני 9, מתניהו",
            phone: "054-4588769",
            aboutMe: "כי את מה שהלב שלי בחר",
            totalRenovations: 25,
            tools: [
                {
                    name: "פטיש",
                    quantity: 2,
                    comment: "peter piper picked a pack of pickled peppers"
		},
                {
                    name: "מקדחה",
                    quantity: 1,
                    comment: "peter piper picked a pack of pickled peppers"
		}
            ]
        },
    ];

    $scope.teams = [
        {
            id: "team_324465778",
            name: "צוות עכוז",
            manager_id: "324465778",
            members_id: [
            "784569885",
            "123456197"
            ]
        },
        {
            id: "team_457894653",
            name: "צוות שלב",
            manager_id: "457894653",
            members_id: [
            "567931643",
            "784659132"
            ]
        }
    ];

    $scope.messages = [
        {
            id: "ren1_chat",
            messages: [
                {
                    user: "משתאווה ברנבנק",
                    content: "עזוב אותי באימא שלך",
                    timestamp: "02/04/2016 15:45"
                },
                {
                    user: "יוחאי רשף",
                    content: "בוא נשחק קצת לול",
                    timestamp: "02/04/2016 15:43"
                }
            ]
        },
        {
            id: "ren2_chat",
            messages: [
                {
                    user: "משתאווה ברנבנק",
                    content: "יה חלאוולאוו",
                    timestamp: "01/04/2016 11:45"
                },
                {
                    user: "יוחאי רשף",
                    content: "כשהחיים נותנים לך לימונים, תפסיק לעשן חשיש אחי",
                    timestamp: "01/04/2016 10:43"
                }
            ]
        }
    ];

    //Mock functions
    $scope.getMemberName = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].name;
            }
        }

        return "No user found!";
    };
    $scope.getMemberJoinDate = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].joined_date;
            }
        }

        return "No user found!";
    };

    $scope.getMemberType = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].type;
            }
        }

        return "No user found!";
    };

    $scope.getMemberTools = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].tools;
            }
        }

        return [];
    };

    $scope.getMemberAvatar = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].avatar;
            }
        }

        return "No user found!";
    };

    $scope.getMemberAddress = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].address;
            }
        }

        return "No user found!";
    };

    $scope.getMemberPhone = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].phone;
            }
        }

        return "No user found!";
    };

    $scope.getMemberAboutMe = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].aboutMe;
            }
        }

        return "No user found!";
    };

    $scope.getMemberTotalRenovations = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].totalRenovations;
            }
        }

        return "No user found!";
    };
    /*End of Mock Object Creations*/
});
