angular.module('ProjectHands')

    .factory('APIService', function ($resource) {

        var baseUrl = '/api';

        var getChatHistory = function (room) {
            return $resource(baseUrl + '/chat/' + room)
                .query().$promise.then(function (data) {

                    console.log('getChatHistory: ', data);
                    return data[0];
                    // var history = [];
                    // var messages =
                    //
                    // for(var i = 0; i < data.length; i++) {
                    //     history.push(data[i]);
                    // }
                    // return history;

                } , function(error) {
                    console.log('getChatHistory Error: ', error);
                    return [];
                });
        };


        return {
            getChatHistory: getChatHistory
        };
    });