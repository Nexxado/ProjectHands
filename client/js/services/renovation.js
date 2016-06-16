/**
 * Created by ND88 on 04/06/2016.
 */
angular.module('ProjectHands')

    .service('RenovationService', function($resource) {

        var baseUrl = '/api/renovation';

        /**
         * Get renovation info
         * @param address {object} : renovation's address
         * @returns {Promise}
         */
        function getRenovation(address) {
            return $resource(baseUrl + '/get_info/:city/:street/:num').get({
                city: address.city,
                street: address.street,
                num: address.num
            });
        }

        /**
         * Get all renovations in database
         * @returns {Promise}
         */
        function getAll() {
            return $resource(baseUrl + '/get_all').query();
        }

        /**
         * Create Renovation
         * @param city {String}
         * @param street {String}
         * @param num {Number | String}
         * @returns {Promise}
         */
        function create(city, street, num) {
            return $resource(baseUrl + '/create').save({
                city: city,
                street: street,
                num: num
            });
        }

        /**
         * Current user will toggle RSVP status on renovation
         * @param address {object} : renovation's address
         * @returns {Promise}
         */
        function rsvp(address) {
            return $resource(baseUrl + '/rsvp').save({
                city: address.city,
                street: address.street,
                num: address.num
            });
        }

        /**
         * Add needed tool to renovation
         * @param address {object} : renovation's address
         * @param tool {object} : tool needed
         * @returns {Promise}
         */
        function addTool(address, tool) {
            return $resource(baseUrl + '/add_tool').save({
                city: address.city,
                street: address.street,
                num: address.num,
                tool: tool
            });
        }


        /**
         * Assign tool to team member
         * @param address {object} : renovation's address
         * @param tool {object} : tool to assign
         * @param email {string} : assignee's email
         * @returns {Promise}
         */
        function assignTool(address, tool, email) {
            return $resource(baseUrl + '/assign_tool').save({
                city: address.city,
                street: address.street,
                num: address.num,
                tool: tool,
                email: email
            });
        }

        /**
         * Unassign tool from team member
         * @param address {object} : renovation's address
         * @param tool {object} : tool to assign
         * @returns {Promise}
         */
        function unassignTool(address, tool) {
            return $resource(baseUrl + '/unassign_tool').save({
                city: address.city,
                street: address.street,
                num: address.num,
                tool: tool
            });
        }

        /**
         * Delete needed tool from renovation
         * @param address {object} : renovation's address
         * @param tool {object} : tool to delete
         * @returns {Promise}
         */
        function deleteTool(address, tool) {
            return $resource(baseUrl + '/delete_tool').save({
                city: address.city,
                street: address.street,
                num: address.num,
                tool: tool
            });
        }


        /**
         * Add new task to renovation
         * @param address {object} : renovation's address
         * @param task {object} : new task
         * @returns {Promise}
         */
        function addTask(address, task) {
            return $resource(baseUrl + '/add_task').save({
                city: address.city,
                street: address.street,
                num: address.num,
                task: task
            });
        }

        /**
         * Assign task to team member
         * @param address {object} : renovation's address
         * @param task {object} : task to assign
         * @param email {string} : assignee's email
         * @returns {Promise}
         */
        function assignTask(address, task, email) {
            return $resource(baseUrl + '/assign_task').save({
                city: address.city,
                street: address.street,
                num: address.num,
                task: task,
                email: email
            });
        }

        /**
         * Mark task in renovation as done
         * @param address {object} : renovation's address
         * @param task {object} : task to mark as done
         * @returns {Promise}
         */
        function doneTask(address, task) {
            return $resource(baseUrl + '/done_task').save({
                city: address.city,
                street: address.street,
                num: address.num,
                task: task
            });
        }

        /**
         * Edit task
         * @param address {object} : renovation's address
         * @param tasks {array} : old task & new task
         * @returns {Promise}
         */
        function editTask(address, tasks) {
            return $resource(baseUrl + '/edit_task').save({
                city: address.city,
                street: address.street,
                num: address.num,
                tasks: tasks
            });
        }

        /**
         * Delete task from renovation
         * @param address {object} : renovation's address
         * @param task {object} : task to delete
         * @returns {Promise}
         */
        function deleteTask(address, task) {
            return $resource(baseUrl + '/delete_task').save({
                city: address.city,
                street: address.street,
                num: address.num,
                task: task
            });
        }

        /**
         * Add new pinned message to renovation
         * @param address {object} : renovation's address
         * @param pinned {object} : new pinned message
         * @returns {Promise}
         */
        function addPinned(address, pinned) {
            return $resource(baseUrl + '/add_pinned').save({
                city: address.city,
                street: address.street,
                num: address.num,
                pinned: pinned
            });
        }

        /**
         * Edit pinned message
         * @param address {object} : renovation's address
         * @param pinneds {array} : old pinned & new pinned messages
         * @returns {Promise}
         */
        function editPinned(address, pinneds) {
            return $resource(baseUrl + '/edit_pinned').save({
                city: address.city,
                street: address.street,
                num: address.num,
                pinneds: pinneds
            });
        }

        /**
         * Delete task from renovation
         * @param address {object} : renovation's address
         * @param pinned {object} : pinned to delete
         * @returns {Promise}
         */
        function deletePinned(address, pinned) {
            return $resource(baseUrl + '/delete_pinned').save({
                city: address.city,
                street: address.street,
                num: address.num,
                pinned: pinned
            });
        }

        /**
         * Add new custom stage to renovation
         * @param address {object} : renovation's address
         * @param stage {object} : new custom stage
         * @param index {number} : position of stage in array
         * @returns {Promise}
         */
        function addStage(address, stage, index) {
            return $resource(baseUrl + '/add_stage').save({
                city: address.city,
                street: address.street,
                num: address.num,
                stage: stage,
                index: index
            });
        }

        /**
         *  Update renovation stage
         * @param address {object} : renovation's address
         * @param stage {string} : new stage
         */
        function updateStage(address, stage) {
            return $resource(baseUrl + '/update_stage').save({
                city: address.city,
                street: address.street,
                num: address.num,
                stage: stage
            });
        }

        return {
            getRenovation: getRenovation,
            getAll: getAll,
            create: create,
            rsvp: rsvp,
            addTool: addTool,
            assignTool: assignTool,
            unassignTool: unassignTool,
            deleteTool: deleteTool,
            addTask: addTask,
            assignTask: assignTask,
            doneTask: doneTask,
            editTask: editTask,
            deleteTask: deleteTask,
            addPinned: addPinned,
            editPinned: editPinned,
            deletePinned: deletePinned,
            addStage: addStage,
            updateStage: updateStage
        };
    });