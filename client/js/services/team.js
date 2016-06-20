/**
 * Created by ND88 on 04/06/2016.
 */
angular.module('ProjectHands')

    .service('TeamService', function($resource) {

        var baseUrl = '/api/team';

        /**
         * Create a new team
         * @param teamName {String} : team name must be unique
         * @param manager_email {String} : email of the user's managers
         * @returns {Promise}
         */
        function createTeam(teamName, manager_email) {
            return $resource(baseUrl + '/create').save({
                teamName: teamName,
                email: manager_email
            });
        }

        /**
         * Delete team from database
         * @param teamName {String}
         * @returns {Promise}
         */
        function deleteTeam(teamName) {
            return $resource(baseUrl + '/delete/:teamName').delete({
                teamName: teamName
            });
        }

        /**
         * Get all teams in database
         * @returns {Promise}
         */
        function getAllTeams() {
            return $resource(baseUrl + '/all_teams').query();
        }

        /**
         * Get team info
         * @param teamName {string}
         */
        function getTeam(teamName) {
            return $resource(baseUrl + '/get_team/:teamName').get({
                teamName: teamName
            });
        }

        /**
         * Add members to team
         * @param teamName {String}
         * @param members {Array} : members to add to team
         * @returns {Promise}
         */
        function addMembers(teamName, members) {
            return $resource(baseUrl + '/add_members').save({
                teamName: teamName,
                members: members
            });
        }

        /**
         * Remove members from team
         * @param teamName {String}
         * @param members {Array} : members to remove from team
         * @returns {Promise}
         */
        function removeMembers(teamName, members) {
            return $resource(baseUrl + '/remove_members').save({
                teamName: teamName,
                members: members
            });
        }

        /**
         * Assign team to work on a renovation
         * @param teamName {String}
         * @param date {object} : the date of the renovation.
         * @param address {object} : contains city, street and house number
         * @returns {Promise}
         */
        function assignToRenovation(teamName, date, address) {
            return $resource(baseUrl + '/assign_to_renovation').save({
                teamName: teamName,
                date: date,
                city: address.city,
                street: address.street,
                num: address.num
            });
        }

        /**
         * Assign a manager to a team
         * @param teamName {String}
         * @param email {String} : the user email of the new team manager.
         * @returns {Promise}
         */
        function assignManager(teamName, email) {
            return $resource(baseUrl + '/assign_manager').save({
                teamName: teamName,
                email: email
            })
        }


        return {
            createTeam: createTeam,
            deleteTeam: deleteTeam,
            getAllTeams: getAllTeams,
            getTeam: getTeam,
            addMembers: addMembers,
            removeMembers: removeMembers,
            assignToRenovation: assignToRenovation,
            assignManager: assignManager
        };
    });