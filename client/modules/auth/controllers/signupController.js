angular.module('ProjectHands.auth')

.controller('SignupController', function ($scope, AuthService, UtilsService) {


    $scope.signup = function () {

        if (!$scope.validateArea() || $scope.SignupForm.$invalid)
            return;

        getSelected($scope.volunteer_areas, $scope.user.area);
        getSelected($scope.preferred_day, $scope.user.preferred_day);
        getSelected($scope.team_leader, $scope.user.team_leader);
        $scope.clearEmptyTextArea();

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
     * Force only one checkbox for be check at each time.
     * Check off every checkbox apart from the newly selected one.
     * @param array {Array} : array of checkboxes models
     * @param index {Number} : Index of the newly selected checkbox
     */
    $scope.forceOneCheckbox = function(array, index) {
        for(var i = 0; i < array.length; i++) {
            if(i !== index) {
                array[i].checked = false;
            }
        }
    };

    /**
     * Validating Volunteer Area checkboxes
     * Making sure at least one is checked
     * @returns {boolean}
     */
    $scope.validateArea = function() {
        for(var i = 0; i < $scope.volunteer_areas.length; i++) {
            if($scope.volunteer_areas[i].checked) {
                angular.element('.signup-form fieldset.required').removeClass('invalid');
                return true;
            }
        }

        angular.element('.signup-form fieldset.required').addClass('invalid');
        return false;
    };


    /**
     * Push selected checkboxes to user object
     * @param checkboxes {Array} : Array of the checkboxes' input models
     * @param property {Array} : property field in $scope.user to push the selected checkboxes to.
     */
    function getSelected(checkboxes, property) {
        for(var i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked)
                property.push(checkboxes[i].label);
        }
    }


    /************************/
    /***** Input Models *****/
    /************************/
    $scope.volunteer_areas = [
        {
            label: 'ירושלים',
            checked: false
        } , {
            label: 'בית שמש',
            checked: false
        } , {
            label: 'מעלה אדומים',
            checked: false
        } , {
            label: 'רמלה-לוד',
            checked: false
        } , {
            label: 'אחר',
            checked: false,
            input: ''
        }
    ];

    $scope.preferred_day = [
        {
            label: 'אין לי יום קבוע',
            checked: false
        } , {
            label: "א' - בוקר",
            checked: false
        } , {
            label: "א' - אחה\"צ",
            checked: false
        } , {
            label: "ב' - בוקר",
            checked: false
        } , {
            label: "ב' - אחה\"צ",
            checked: false
        } , {
            label: "ג' - בוקר",
            checked: false
        } , {
            label: "ג' - אחה\"צ",
            checked: false
        } , {
            label: "ד' - בוקר",
            checked: false
        } , {
            label: "ד' - אחה\"צ",
            checked: false
        } , {
            label: "ה' - בוקר",
            checked: false
        } , {
            label: "ה' - אחה\"צ",
            checked: false
        }
    ];

    $scope.team_leader = [
        {
            label: 'כן',
            checked: false
        } , {
            label: 'לא',
            checked: false
        } , {
            label: 'עוד לא סגור על זה',
            checked: false
        }
    ];

    $scope.user = {
        name: '',
        email: '',
        password: '',
        phone: '',
        area: [],
        preferred_day: [],
        team_leader: [],
        remarks: '\n\n\n\n\n',
        extra: ''
    };

    $scope.signupSuccess = false;
    $scope.toastAnchor = 'form';

    /**
     * Workaround for angular material not respecting "rows" attribute on textarea tag
     * Initializing the model (user.remarks) with a newline char per row
     * Deleting all of them on focus.
     */
    $scope.clearEmptyTextArea = function() {
        if($scope.user.remarks.match(/^\s+$/))
            $scope.user.remarks = '';
    }
});
