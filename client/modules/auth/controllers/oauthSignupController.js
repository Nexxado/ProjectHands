/**
 * Created by ND88 on 21/05/2016.
 */

angular.module('ProjectHands.auth')

    .controller('OAuthSignupController', function ($scope, AuthService, UtilsService, $state) {

        $scope.info = {
            realID: ''
        };

        $scope.toastAnchor = 'form';

        $scope.submit = function () {
            console.info('submitting info');
            if ($scope.OAuthSignupForm.$invalid)
                return;

            if (!AuthService.isLegalID($scope.info.realID)) {
                UtilsService.makeToast('תעודת זהות אינה חוקית', $scope.toastAnchor, 'bottom right');
                return;
            }

            AuthService.oauthSignup($scope.info).$promise
                .then(function (result) {
                    console.log('oauthSignup result', result);
                    $state.go('home')
                        .then(function () {
                            UtilsService.makeToast('תהליך ההרשמה הושלם בהצלחה', $scope.rootToastAnchor, 'bottom right');
                        })
                })
                .catch(function (error) {
                    console.log('oauthSignup error', error);
                    UtilsService.makeToast("Error!", $scope.toastAnchor, 'bottom right');
                });
        };

    });
