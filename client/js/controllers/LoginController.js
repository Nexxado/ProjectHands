/**
 * Created by DarKingDooM on 4/18/2016.
 */
angular.module("ProjectHands").controller("loginController", function ($scope, UsersService) {

    $scope.username = "";
    $scope.password = "";
    $scope.status = "Not logged in";
    $scope.foo = function () {
        var time = new Date().getTime();
        var rand = Math.floor(Math.random() * 1000);
        var key = UsersService.hashSha512($scope.username, time, rand, $scope.password);
        UsersService.login($scope.username, time, rand, key).$promise.then(function (data) {
            // UsersService.cookieWrite("username", $scope.username);
            window.alert(JSON.stringify(data));
            $scope.status = JSON.stringify(data).toString();

        }).catch(function (error) {
            window.alert('login error ', error);
        });


    };


});