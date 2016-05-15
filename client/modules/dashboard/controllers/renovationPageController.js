angular.module('ProjectHands.dashboard')

.controller('RenovationPageController', function ($scope, $stateParams) {

	
	console.log("Testing to see if params arrive safely: " , $stateParams.city, $stateParams.street, $stateParams.num);
	$scope.thisRenovation = "";
	$scope.renovationNotFound = false;
	console.log("Renovations are: ", $scope.renovations);
	console.log("my id is: ", $scope.myUser._id);
	
	$scope.getRenovation = function(city, street, num){
		console.log("Searching for renovation");
		console.log($scope.renovations);
		for(var reno in $scope.renovations){
			var renovation = $scope.renovations[reno];
			if(renovation.addr.city == city && renovation.addr.street == street && renovation.addr.num == num){
				$scope.thisRenovation = renovation;
				console.log("Renovation found in User Reno array");
				return;
			}
		}
		console.log("Reno wasnt found!");
		$scope.renovationNotFound = true;
		
	}
	
	$scope.getRenovation($stateParams.city, $stateParams.street, $stateParams.num);
	
	$scope.renovationChatRoom = [$scope.thisRenovation.chat_id];

	$scope.getMemberByID = function(id){
		for(var i in $scope.teamMembers){
			var teamMember = $scope.teamMembers[i];
			if(teamMember._id == id)
				return teamMember;
		}
		return "User not found!";
	}
});
