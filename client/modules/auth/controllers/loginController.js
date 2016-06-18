angular.module('ProjectHands.auth')

.controller('LoginController', function ($scope, $rootScope, UtilsService, SessionService, AuthService, AUTH_EVENTS, 
                                         $window, $mdDialog, $mdMedia) {

    var toastAnchor = '#loginToastsAnchor';

    /***** Form Model *****/
    $scope.email = '';
    $scope.password = '';
    $scope.rememberMe = false;

    $scope.login = function () {

        if ($scope.LoginForm.$invalid)
            return;

        AuthService.login($scope.email, $scope.password, $scope.rememberMe)
            .then(function (data) {
                console.log('auth data', data);
                SessionService.startSession(data);
                resetForm();

            })
            .catch(function (error) {
                console.log('login error ', error);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                UtilsService.makeToast('האימייל או הסיסמה אינם נכונים', toastAnchor, 'bottom right');
            });
    };

    /********************************/
    /***** OAuth2 Login Methods *****/
    /********************************/
    $scope.loginGoogle = function() {
        $window.open('/api/auth/google','',' scrollbars=yes,menubar=no,width=500, resizable=yes,toolbar=no,location=no,status=no');
    };

    $scope.loginFacebook = function() {
        $window.open('/api/auth/facebook','',' scrollbars=yes,menubar=no,width=500, resizable=yes,toolbar=no,location=no,status=no');
    };

    $window.loginCallBack = function() {
        console.log('loginCallBack');
        SessionService.getSession();
    };


    $scope.resetPassword = function($event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

        $mdDialog.show({
            controller: function ($scope, $mdDialog, AuthService, regexEmail) {

                $scope.regexEmail = regexEmail;

                //Input Models
                $scope.reset = {
                    email: '',
                    newPass1: '',
                    newPass2: ''
                };

                //Set Form elements to Invalid if the 2 new passwords input don't match.
                $scope.newPassMatch = function() {
                    $scope.ResetPasswordForm.newPass1.$setValidity('match', $scope.reset.newPass1 === $scope.reset.newPass2);
                    $scope.ResetPasswordForm.newPass2.$setValidity('match', $scope.reset.newPass1 === $scope.reset.newPass2);
                };


                $scope.submit = function() {

                    if($scope.ResetPasswordForm.$invalid)
                        return;

                    console.info('reseting password', $scope.reset);
                    AuthService.resetPassword($scope.reset.email, $scope.reset.newPass1).$promise
                        .then(function (result) {
                            console.info('resetPassword result', result);
                            $mdDialog.hide(true);
                        })
                        .catch(function (error) {
                            console.info('resetPassword error', error);
                            $mdDialog.hide(false);
                        });
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                }
            },
            templateUrl: '/templates/dialogs/resetPassword.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            locals: {
                regexEmail: $scope.regexEmail
            }
        })
            .then(function (result) {


            }, function () {
                //Dialog Canceled
            });
    };

    
    function resetForm() {
        $scope.email = '';
        $scope.password = '';
        $scope.LoginForm.$setPristine();
        $scope.LoginForm.$setUntouched();
        $scope.rememberMe = false;
    }
    
});
