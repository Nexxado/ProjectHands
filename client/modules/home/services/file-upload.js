angular.module('ProjectHands.home')

    .service('fileUpload', ['$http', function ($http) {

        this.uploadFileToUrl = function (file, uploadUrl) {
            console.log("service uploadFileToUrl");
            var fd = new FormData();
            fd.append('file', file);

            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })

                .success(function () {
                })

                .error(function () {
                });
        }
    }]);

