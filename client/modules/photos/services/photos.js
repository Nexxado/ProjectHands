angular.module('ProjectHands.photos')

    .factory("PhotosService", function ($rootScope, $resource, $cookies, $q, AUTH_EVENTS, UtilsService) {

        var baseUrl = '/api/photos';

        function deletePhoto(fileId) {
            var deferred = $q.defer();
            $resource(baseUrl + '/delete').delete({
                file_id: fileId
            })
                .$promise
                .then(function (result) {
                    deferred.resolve(result);

                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getPhotos(album) {
            var deferred = $q.defer();
            $resource(baseUrl + '/album').query({
                album: album
            }).$promise
                .then(function (result) {
                    console.log(result);
                    deferred.resolve(result);

                })
                .catch(function (error) {
                    console.log(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        }


        return {
            deletePhoto: deletePhoto,
            getPhotos: getPhotos
        };
    });
