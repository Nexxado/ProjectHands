/**
 * Created by ND88 on 04/06/2016.
 */
angular.module('ProjectHands')

    .service('RenovationService', function($resource) {

        var baseUrl = '/api/renovation';

        /**
         * Get renovation info
         * @param address {object}
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
         * @param city {String}
         * @param street {String}
         * @param num {Number | String}
         * @returns {Promise}
         */
        function rsvp(city, street, num) {
            return $resource(baseUrl + '/rsvp').save({
                city: city,
                street: street,
                num: num
            });
        }

        return {
            getRenovation: getRenovation,
            getAll: getAll,
            create: create,
            rsvp: rsvp
        };
    });