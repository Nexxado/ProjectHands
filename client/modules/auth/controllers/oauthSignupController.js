/**
 * Created by ND88 on 21/05/2016.
 */

angular.module('ProjectHands.auth')
    
.controller('OAuthSignupController', function($scope, AuthService) {
    
    $scope.info = {
        realID: ''
    };

    $scope.toastAnchor = 'form';

    $scope.submit = function () {
        console.info('submitting info');
        if ($scope.OAuthSignupForm.$invalid)
            return;

        if(!AuthService.isLegalID($scope.info.realID)) {
            UtilsService.makeToast('תעודת זהות אינה חוקית', $scope.toastAnchor, 'bottom right');
            return;
        }

        AuthService.oauthSignup($scope.info).$promise
            .then(function (result) {
                console.log('oauthSignup result', result);
            })
            .catch(function (error) {
                console.log('oauthSignup error', error);
        });
    };
    
});
