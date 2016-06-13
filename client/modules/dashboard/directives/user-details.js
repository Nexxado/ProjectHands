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
        controller: function($scope) {

            $scope.isEmpty = function(variable) {
                if(typeof variable === 'string')
                    return variable === '';
                else if(Array.isArray(variable))
                    return variable.length === 0;
                else
                    return true;
            }
        }
    };
});