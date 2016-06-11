/**
 * Created by ND88 on 21/05/2016.
 */

angular.module('ProjectHands.auth')

    .controller('OAuthSignupController', function ($scope, AuthService, UtilsService, $state) {


        $scope.submit = function () {

            if (!$scope.validateArea() || $scope.OAuthSignupForm.$invalid)
                return;

            getSelected($scope.volunteer_areas, $scope.info.area);
            getSelected($scope.preferred_day, $scope.info.preferred_day);
            getSelected($scope.team_leader, $scope.info.team_leader);
            $scope.clearEmptyTextArea();

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


        $scope.toastAnchor = 'form';
        $scope.regexPhone = /^0(5(2|3|4|7|8)|(2|3|4|8)|77 )-?\d{4}-?\d{3}$/;
        $scope.regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        $scope.info = {
            phone: '',
            area: [],
            preferred_day: [],
            team_leader: [],
            remarks: '\n\n\n\n\n',
            extra: ''
        };

        /**
         * Workaround for angular material not respecting "rows" attribute on textarea tag
         * Initializing the model (user.remarks) with a newline char per row
         * Deleting all of them on focus.
         */
        $scope.clearEmptyTextArea = function() {
            if($scope.info.remarks.match(/^\s+$/))
                $scope.info.remarks = '';
        }

    });
