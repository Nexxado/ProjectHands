angular.module('ProjectHands')

    .factory('APIService', function ($resource) {

        var baseUrl = '/api';

        var chat = {
            query: function (room) {
                return $resource(baseUrl + '/chat/:room').query({room: room});
            }
        };

        var team = {
            query: function (team_id) {
                return $resource(baseUrl + '/team/:id').query({id: team_id});
            }
        };

        var user = {
            query: function (user_id) {
                return $resource(baseUrl + '/user/:id').query({id: user_id});
            }
        };

        var renovation = {
            query: function (query, value) {
                return $resource(baseUrl + '/renovation/:query&:value').query({query: query, value: value});
            }

        };

        return {
            chat: chat,
            team: team,
            user: user,
            renovation: renovation
        };
    });