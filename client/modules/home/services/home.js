angular.module('ProjectHands.photos')

    .factory("HomeService", function ($rootScope, $resource, $cookies, Upload, $q) {

        var baseUrl = '/api/home';

        function uploadAd(title, content) {
            var deferred = $q.defer();
            
            $resource(baseUrl + '/upload').save({
                title: title,
                content: content
            })
                .$promise
                .then(function (result) {
                    deferred.resolve(result);

                }, function (error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        }

        function deleteAd(id) {
            var deferred = $q.defer();
            $resource(baseUrl + '/delete').delete({
                id: id
            })
                .$promise
                .then(function (result) {
                    deferred.resolve(result);

                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getAds() {
            var deferred = $q.defer();
            $resource(baseUrl + '/ads').query({
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

        function editAd(ad) {
            return $resource(baseUrl + '/edit-ad').save({
                _id: ad._id,
                title: ad.title,
                content: ad.content
            });
        }
        
        return {
            deleteAd: deleteAd,
            getAds: getAds,
            uploadAd: uploadAd,
            editAd: editAd
        };
    });
