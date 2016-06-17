/**
 * Created by ND88 on 25/05/2016.
 */
angular.module('ProjectHands')

    .service('StatusService', function($resource) {

        var baseUrl = '/api/status';

        /**
         * Get current referral status
         * @returns {Promise}
         */
        function getStatus() {
            return $resource(baseUrl + '/get_status').get();
        }

        /**
         * Update referral status and message
         * @param active {boolean}
         * @param message {string}
         * @returns {Promise}
         */
        function updateStatus(active, message) {
            return $resource(baseUrl + '/update_status').save({
                active: active,
                message: message
            });
        }

        return {
            getStatus: getStatus,
            updateStatus: updateStatus
        };
    });