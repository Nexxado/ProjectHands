/**
 * Created by ND88 on 21/05/2016.
 */
angular.module('ProjectHands')

    .factory('ChatService', function ($resource) {

        var baseUrl = '/api/chat';
        
        function getChatHistory(chatId) {
            return $resource(baseUrl + '/history/:chatId').get({chatId: chatId});
        }

        return {
            getChatHistory: getChatHistory
        };
    });