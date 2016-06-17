/**
 * Created by ND88 on 27/05/2016.
 */
angular.module('ProjectHands')

.directive('adminActions', function($compile, ROLES) {
    return {
        restrict: 'A',
        replace: false,
        terminal: true, //this setting is important, see explanation below
        priority: 1000, //this setting is important, see explanation below
        link: function compile(scope, element, attrs) {

            scope.hasAdminPermission = scope.user && scope.user.role === ROLES.ADMIN;

            scope.$watch('user', function(newVal, oldVal, scope) {
                scope.hasAdminPermission = scope.user && scope.user.role === ROLES.ADMIN;
            });
            
            element.addClass('admin-actions-container');
            element.attr('ng-show', 'hasAdminPermission');
            element.attr('layout-align', 'center center');
            element.attr('md-whiteframe', '3');

            element.removeAttr('admin-actions'); //remove the attribute to avoid infinite loop

            $compile(element)(scope);
        }
    }
});


/**
 * If we don't set terminal:true and priority: 1000 (a high number),
 * there is a chance that some directives are compiled before our custom directive.
 * And when our custom directive uses $compile to compile the element => compile again the already compiled directives.
 * This will cause unpredictable behavior especially if the directives compiled before our custom directive have already transformed the DOM.
 */
