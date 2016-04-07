angular.module('ProjectHands')

    .factory('APIService', function ($resource) {

        var baseUrl = '/api';

        function chat() {
            return $resource(baseUrl + '/chat/:room');
        }



        return {
            chat: chat
        };
    });