angular.module('ProjectHands.dashboard')

.controller('DashboardTeamController', function ($scope, $stateParams, DatabaseService, COLLECTIONS) {

	console.log("team id is: ", $stateParams.team_id);
	var teamID = $stateParams.team_id;
	$scope.teamMembers = [];
	$scope.team = null;
	DatabaseService.query(COLLECTIONS.TEAMS, {
		_id: teamID
	}).$promise.then(function (result) {
		$scope.team = result[0];
		var team = $scope.team;
		populateTeamMembers(team);


	}).catch(function (error) {
		console.log("Error: ", error);
	});

	var populateTeamMembers = function (team) {
		for (var i in team.members_email) {
			getMemberByEmail(team.members_email[i]);
		}
	};
	
	var getMemberByEmail = function(email){
		DatabaseService.query(COLLECTIONS.USERS, {
				email: email
			}).$promise.then(function (result) {
				$scope.teamMembers.push(result[0]);
			}).catch(function (error) {
				console.log("Error: ", error);
			});
	};
});
