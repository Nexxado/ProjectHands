/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands.dashboard')

.directive('userDetails', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            user: '='
        },
        templateUrl: 'modules/dashboard/templates/directives/user-details.html',
        controller: function($scope, UtilsService) {
            $scope.$watch('user', function(newVal, oldVal, scope) {
                if(scope.user) {
                    if(scope.user.joined_date)
                        scope.user.joined_date = UtilsService.dateToDDMMYYYY(new Date(scope.user.joined_date));
                    if(scope.user.signupDate)
                        scope.user.signupDate = UtilsService.dateToDDMMYYYY(new Date(scope.user.signupDate));
                }
            })
        }
    };
});