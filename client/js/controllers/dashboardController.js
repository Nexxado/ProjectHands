angular.module('ProjectHands')

.controller('DashboardController', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
	$scope.dan = true;
	localStorage.setItem("hello", JSON.stringify($scope.dan));
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$scope.dan2 = JSON.parse(localStorage.getItem("hello"));
});
