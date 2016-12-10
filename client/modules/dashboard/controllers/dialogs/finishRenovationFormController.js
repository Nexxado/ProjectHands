/**
 * Created by ND88 on 08/12/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('FinishRenovationFormController', function($scope, $mdDialog, UtilsService) {
    var toastAnchor = '.md-dialog-content';

    $scope.renovation = {
        name: '',
        // address: '',
        phone: '',
        referrer: '',
        referrer_email: '',
        referrer_phone: '',
        // date: '',
        hours: '',
        // volunteers_num: '',
        // volunteers_names: '',
        what_done: '',
        secondVisit: false
    };

    /**
     * Submit dialog
     * pass arrays back to invoking controller
     */
    $scope.submit = function() {
        if($scope.FinishRenovationForm.$invalid)
            return UtilsService.makeToast("ישנם שדות חובה שלא מולאו", toastAnchor, 'top right');

        console.info('dialog approved');
        $mdDialog.hide($scope.renovation);
    };

    /**
     * Cancel dialog, abort any changes made.
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});