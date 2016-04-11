angular.module('ProjectHands')

.controller('DashboardToolboxController', function ($scope) {
	$scope.tools = [
		{
			name: "פטיש",
			quantity: 2
		},
		{
			name: "מקדחה",
			quantity: 1
		},
		{
			name: "ברגים",
			quantity: 1230
		},
		{
			name: "מסור",
			quantity: 3
		},
		{
			name: "קאטר",
			quantity: 1
		},
		{
			name: "דבק",
			quantity: 12
		},
		{
			name: "חול",
			quantity: 4
		},
		{
			name: "מברג",
			quantity: 2
		},
	];
});
