/**
 * Created by ND88 on 25/05/2016.
 */
angular.module('ProjectHands')

    .controller('StatusController', function ($scope, $mdDialog, $mdMedia, UtilsService, StatusService) {

        //View Model
        $scope.active = false;
        $scope.message = '';
        $scope.updateSuccess = false;


        StatusService.getStatus().$promise
            .then(function (result) {
                $scope.active = result.active;
                $scope.message = result.message;
            })
            .catch(function (error) {

            });


        /**
         * Invoke "Update Status" dialog
         * @param $event
         */
        $scope.updateStatusDialog = function ($event) {

            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

            $mdDialog.show({
                controller: function ($scope, $mdDialog, message, active) {

                    //Input model
                    $scope.newStatus = {
                        message: message,
                        status: active
                    };
                    $scope.checkbox_label = $scope.newStatus.status ? 'פעיל' : 'לא פעיל';

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    /**
                     * Update the current organization status.
                     */
                    $scope.submit = function () {
                        if ($scope.UpdateStatusForm.$invalid)
                            return;
                        $mdDialog.hide($scope.newStatus);
                    };

                    /**
                     * Update form's checkbox label
                     */
                    $scope.updateLabel = function () {
                        $scope.checkbox_label = $scope.newStatus.status ? 'לא פעיל' : 'פעיל'
                    };
                },
                templateUrl: '/templates/dialogs/status.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    message: $scope.message,
                    active: $scope.active
                }
            })
                .then(function (newStatus) {

                    StatusService.updateStatus(newStatus.status, newStatus.message).$promise
                        .then(function (result) {
                            $scope.active = result.active;
                            $scope.message = result.message;
                            UtilsService.makeToast("הסטטוס עודכן בהצלחה!", $scope.rootToastAnchor, 'top right');
                        })
                        .catch(function (error) {
                            UtilsService.makeToast("עדכון הסטטוס נכשל!", $scope.rootToastAnchor, 'top right');
                        });

                }, function () {
                    //Dialog Canceled
                });

        };
    });
