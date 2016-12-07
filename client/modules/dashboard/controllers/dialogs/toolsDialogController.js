/**
 * Created by ND88 on 01/12/2016.
 */
angular.module('ProjectHands.dashboard')

.controller('ToolsDialogController', function ($scope, $mdDialog, $timeout, toolsInRenovation, RenovationService, UtilsService) {
    $scope.toolsInRenovation = toolsInRenovation;
    $scope.tools = [];
    $scope.newTool = {
        name: '',
        quantity: 1
    };

    //Arrays to hold member changes
    var toolsAdded = [];
    var toolsRemoved = [];

    var toastAnchor = '.md-dialog-content';

    getDefaultRenovationTools();


    /**
     * Get default renovation tools from Database
     */
    function getDefaultRenovationTools() {
        RenovationService.getTools().$promise
            .then(function(result) {
                $scope.tools = result;
            })
            .catch(function(error) {

            });
    }

    /**
     * Submit dialog
     * pass arrays back to invoking controller
     */
    $scope.submit = function() {
        if($scope.EditToolsForm.$invalid)
            return UtilsService.makeToast("ישנם כלים עם כמות לא חוקית", toastAnchor, 'top right');

        console.info('dialog approved');
        $mdDialog.hide($scope.toolsInRenovation);
    };

    /**
     * Cancel dialog, abort any changes made.
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    /**
     * Add tool to renovation
     * @param index {Number} : index of tools in array of tools
     * @param tool {Object|String} : the tool to be added
     */
    $scope.addToolToRenovation = function(index, tool) {
        $scope.tools.splice(index, 1);
        $scope.toolsInRenovation.push(tool);

        //Update arrays holding tools changes
        toolsAdded.push(toolsAdded);
        if(toolsRemoved.indexOf(toolsAdded) >= 0)
            toolsRemoved.splice(toolsRemoved.indexOf(toolsAdded), 1);
    };

    /**
     * Remove tool from renovation
     * @param index {Number} : index of tools in array of tools
     * @param tool {Object|String} : the tool to be added
     */
    $scope.removeToolFromRenovation = function(index, tool) {
        $scope.toolsInRenovation.splice(index, 1);
        $scope.tools.push(tool);

        //Update arrays holding tools changes
        toolsRemoved.push(tool);
        if(toolsAdded.indexOf(tool) >= 0)
            toolsAdded.splice(toolsAdded.indexOf(tool), 1);

    };

    $scope.addNewTool = function() {
        if($scope.newTool.name === '')
            return;

        //Check for duplicates
        for(var i = 0; i < $scope.toolsInRenovation.length; i++) {
            if($scope.toolsInRenovation[i].name === $scope.newTool.name)
                return UtilsService.makeToast("כלי כבר קיים", toastAnchor, 'top right');
        }

        $scope.toolsInRenovation.push($scope.newTool);
        toolsAdded.push($scope.newTool);
        $scope.newTool = {
            name: '',
            quantity: 1
        };
    };

    //Scroll to bottom on new user in list
    $scope.$watchCollection('tools', function(newVal, oldVal, scope) {
        if(newVal.length > oldVal.length)
            scrollToBottom("#default-tools-list");
    });

    //Scroll to bottom on new team member in list
    $scope.$watchCollection('toolsInRenovation', function(newVal, oldVal, scope) {
        if(newVal.length > oldVal.length)
            scrollToBottom("#renovation-tools-list");
    });

    function scrollToBottom(elementSelector) {
        $timeout(function () {
            var element = angular.element(elementSelector);
            element.scrollTop(element[0].scrollHeight);
        });
    }
});