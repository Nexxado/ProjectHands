angular.module('ProjectHands')

.controller('DashboardController', function ($scope) {



    /* Mock Objects creations: */

    $scope.myID = "324465778";
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

        return "";
    };
    
      $scope.getMemberAddress = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].address;
            }
        }

        return "";
    };
    
      $scope.getMemberPhone = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].phone;
            }
        }

        return "";
    };
    
      $scope.getMemberAboutMe = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].aboutMe;
            }
        }

        return "";
    };
    
      $scope.getMemberTotalRenovations = function (id) {
        var i;
        for (i in $scope.users) {
            if ($scope.users[i].id == id) {
                return $scope.users[i].totalRenovations;
            }
        }

        return "";
    };
    
});
