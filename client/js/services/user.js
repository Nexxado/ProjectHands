/**
 * Created by ND88 on 04/06/2016.
 */
angular.module('ProjectHands')

    .service('UserService', function($resource) {

        var baseUrl = '/api/user';

        /**
         * Get User info
         * @param email {String} : user's email
         * @returns {Promise}
         */
        function getUser(email) {
            return $resource(baseUrl + '/get_info/:email').get({email: email});
        }

        /**
         * Get all volunteers in database
         * @returns {Promise}
         */
        function getAllVolunteers() {
            return $resource(baseUrl + '/all_users').query();
        }

        /**
         * Get all signups in database
         * signup is a user that has completed the signup process but has not yet been approved by the admin
         * @returns {Promise}
         */
        function getAllSignups() {
            return $resource(baseUrl + '/all_signups').query();
        }

        /**
         * Approve User to join project hands and assign new role
         * @param email {String} : user's email
         * @param role {String} : role to assign to user
         * @returns {Promise}
         */
        function approveUser(email, role) {
            return $resource(baseUrl + '/rsvp').save({
                email: email,
                role: role
            });
        }

        /**
         * Delete user from database
         * @param email {String} : user's email
         * @returns {Promise}
         */
        function deleteUser(email) {
            return $resource(baseUrl + '/delete/:email').delete({
                email: email
            });
        }

        /**
         * Update a users role
         * @param email {String} : user's email
         * @param newRole {String} : new role to assign to user
         * @returns {Promise|*|{method}|Session}
         */
        function updateRole(email, newRole) {
            return $resource(baseUrl + '/assign_role').save({
                email: email,
                newRole: newRole
            });
        }

        return {
            getUser: getUser,
            getAllUsers: getAllVolunteers,
            getAllSignups: getAllSignups,
            approveUser: approveUser,
            deleteUser: deleteUser,
            updateRole: updateRole
        };
    });