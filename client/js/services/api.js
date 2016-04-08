angular.module('ProjectHands')

    .factory('APIService', function ($resource) {

        var baseUrl = '/api';

        function chat(room) {
            return $resource(baseUrl + '/chat/:room').query({room: room});
        }



        return {
            chat: chat
        };
    });