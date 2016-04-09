angular.module('ProjectHands')

.controller('DashboardController', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
    
    $scope.notification = {
        title: "",
        description: "",
        timestamp: ""
    };
    
    $scope.user = {
        name: "",
        lastname: "",
        username: "",
        password: "",
        team: "",
        permissions: ""
    };
    
    $scope.permissions = ["Admin", "Team-Leader", "Volunteer"];
    
    $scope.message = {
        sender: "",
        contents: "",
        timestamp: ""
    };
    
    $scope.team = {
        name: "",
        team_leader: "",
        members: [],
        area: ""
    };
    
    $scope.mockTeams = [];
    $scope.mockUsers = [];
    $scope.mockMessages = [];
    $scope.mockNotifications = [];
    
//        localStorage.setItem("mockTeams", JSON.stringfy($scope.mockTeams));
//        localStorage.setItem("mockUsers", JSON.stringfy($scope.mockUsers));
//        localStorage.setItem("mockMessages", JSON.stringfy($scope.mockMessages));
//        localStorage.setItem("mockNotifications", JSON.stringfy($scope.mockNotifications));
    
    $scope.mockData = function(){
        var users = JSON.parse(localStorage.getItem("mockUsers"));
        if(users === null)
            users = [];
        console.log("mocking data");
        $scope.user.name = "Dan";
        $scope.user.lastname = "Draiman";
        $scope.user.username = "DDraiman1990";
        $scope.user.password = "1234";
        $scope.user.team = "None";
        $scope.user.permissions = "Admin";

        users.push($scope.user);
        console.log("finished mocking data");
        var i;
        for(i in users)
            console.log("mock users is: " + users[i].name);
        localStorage.setItem("mockTeams", JSON.stringify(users));
    };
});
