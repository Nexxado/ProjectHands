angular.module('ProjectHands.auth')

.controller('SignupController', function ($scope, AuthService, UtilsService) {

    $scope.signupSuccess = false;
    $scope.user = {
        email: '',
        password: '',
        realID: '',
        name: ''
    };

    $scope.toastAnchor = 'form';

    $scope.signup = function () {

        if ($scope.SignupForm.$invalid)
            return;

        if(!isLegalID($scope.user.realID)) {
            UtilsService.makeToast('תעודת זהות אינה חוקית', $scope.toastAnchor, 'bottom right');
            return;
        }

        AuthService.signup($scope.user).$promise
            .then(function (data) {
                console.log('data', data);
                $scope.signupSuccess = data.success;
            }).catch(function (error) {
                console.log('error', error);
                UtilsService.makeToast(error.data.errMessage, $scope.toastAnchor, 'bottom right');
            });
    };


    /**
     * Checks if a 9 Digit ID is a legal Israeli ID
     * @param   {string}  id : 9 digit ID number as string
     * @returns {boolean} : true if legal ID, otherwise false
     * Algorithm:
     * 1) Multiply each ID digit with each corrsponding ID of the check number
     * 2) For any result with 2 digits, add the digits together
     * 3) Sum all the resulting numbers, if the sum is divisble by 10, its legal.
     */
    function isLegalID(id) {

        var check = "121212121";
        var array = [];
        var sum = 0;

        for(var i =  0; i < id.length; i++) {
            var result = parseInt(id.charAt(i)) * parseInt(check.charAt(i));
            array.push(result);
        }

        for(var i = 0; i < array.length; i++) {
            if(array[i] >= 10) {
                var numStr = array[i].toString();
                var result = parseInt(numStr.charAt(0)) + parseInt(numStr.charAt(1));
                array[i] = result;
            }
        }

        for(var i = 0; i < array.length; i++) {
            sum += array[i];
        }


        return !(sum % 10);
    }
});
