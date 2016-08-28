angular.module('ProjectHands.dashboard')

.controller('DashboardController', function ($scope, DatabaseService, COLLECTIONS, $mdMedia, $mdDialog, ROLES, RenovationService, RENOVATION_STAGES) {
	$scope.ROLES = ROLES;

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
    
    $scope.finishedRenovations = [];
	/*Default renovation Stages*/
	$scope.defaultRenoStages = ["ביקור ראשוני בדירה לבדיקת התאמה",
            "הוחלט לשפץ, יש צורך לעדכן עובד סוציאלי",
            "עובד סוציאלי עודכן, יש צורך לשבץ צוות",
            "על ראש הצוות להגיע לביקור לצרכי תכנון",
            "שלב ההכנות לשיפוץ",
            "הדירה בשיפוץ",
            "הסתיים השיפוץ"];
	//		
	//        /*The first database query to run. getting Logged user, then his team, then all teams*/
	//        DatabaseService.query(COLLECTIONS.USERS, {
	//            email: $scope.user.email
	//        }).$promise.then(function (result) {
	//            $scope.myUser = result[0];
	//            // $scope.getUserTeam($scope.myUser.email);
	//            $scope.getAllTeams();
	//            $scope.getRenovations();
	//
	//        }).catch(function (error) {
	//            console.log("Error: ", error);
	//        });
	//
	//        /*Function to get the specific user's team and then getting all the future renovations*/
	//        $scope.getUserTeam = function (email) {
	//			console.log("called getUserTeam");
	//            DatabaseService.query(COLLECTIONS.TEAMS, {
	//                members: {$in: [email]}
	//            }).$promise.then(function (result) {
	//                $scope.myTeam = result[0];
	//                for (var i in $scope.myTeam.members) {
	//                    $scope.getTeamMember($scope.myTeam.members[i]);
	//                }
	//                $scope.getRenovations();
	//            }).catch(function (error) {
	//                console.log("Error: ", error);
	//            });
	//        };
	//
	//
	//        /*Function to get a team member by his email address*/
	//        $scope.getTeamMember = function (memberEmail) {
	//			console.log("called get team member");
	//            DatabaseService.query(COLLECTIONS.USERS, {
	//                email: memberEmail
	//            }).$promise.then(function (result) {
	//                $scope.teamMembers.push(result[0]);
	//            }).catch(function (error) {
	//                console.log("Error: ", error);
	//            });
	//        };

	/*Function to get all renovations of Project Hands*/
	$scope.getRenovations = function () {
		console.log("called all renovations");
		// RenovationService.getAll() //TODO change back to getALL if there are issues
		if($scope.user.role === ROLES.ADMIN) {
			RenovationService.getAll()
				.$promise.then(function (result) {
				var allRenovations = result;
				for(var i = 0; i < allRenovations.length; i++){
					if(allRenovations[i].finished){
						$scope.finishedRenovations.push(allRenovations[i]);
					}
					else{
						$scope.renovations.push(allRenovations[i]);
					}
				}
//				$scope.renovations = result;
			}).catch(function (error) {
				console.log("Error: ", error);
			});
		} else {
			RenovationService.getAllUserRenovations()
				.$promise.then(function (result) {
				var allRenovations = result;
				for(var i = 0; i < allRenovations.length; i++){
					if(allRenovations[i].finished){
						$scope.finishedRenovations.push(allRenovations[i]);
					}
					else{
						$scope.renovations.push(allRenovations[i]);
					}
				}
//				$scope.renovations = result;
			}).catch(function (error) {
				console.log("Error: ", error);
			});
		}
	};

	/*Dialog to add a renovation by Address*/
	$scope.addRenovation = function ($event) {
		var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
		$mdDialog.show({
				controller: function ($scope, $mdToast, $mdDialog, defaultStages) {
					$scope.defaultStages = defaultStages;
					console.log($scope.defaultStages);
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
						"renovation_stages": $scope.defaultStages,
						"current_stage": $scope.defaultStages[0]
					};
					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.submit = function () {
						if ($scope.AddRenovationForm.$invalid) {
							return;
						}
						
						$scope.renovation.chat_id = "" + $scope.renovation.addr.city + ", " + $scope.renovation.addr.street + "" + $scope.renovation.addr.num;
						
						console.log("reno is: ", $scope.renovation);
						$mdDialog.hide($scope.renovation);
					};
				},
				templateUrl: '/modules/dashboard/templates/dialogs/addRenovationDialog.html',
				targetEvent: $event,
				clickOutsideToClose: false,
				fullscreen: useFullScreen,
				locals: {
					defaultStages: $scope.defaultRenoStages
				}
			})
			.then(function (newReno) {
//				 DatabaseService.insert(COLLECTIONS.RENOVATIONS, newReno)
					RenovationService.create(newReno.addr.city, newReno.addr.street, newReno.addr.num)
					.$promise.then(function (result) {
						$scope.renovations.push(newReno);
					}).catch(function (error) {
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
	};

	$scope.getRenovations();


});
