angular.module('ProjectHands.upload')

.factory("PhotosService", function ($rootScope, $resource, $cookies, $q, AUTH_EVENTS, UtilsService) {

    var baseUrl = '/api/photos';

    function deletePhoto(fileId) {
        var deferred = $q.defer();
        $resource('/api/upload/delete').save({
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
    function login(username, password, rememberMe) {
        var deferred = $q.defer();


        $resource(baseUrl + '/login').save({
                email: username,
                password: password
            })
            .$promise
            .then(function (result) {
                deferred.resolve(result);

            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function isLoggedIn() {
        return $resource(baseUrl + '/isLoggedIn').get();
    }

    function logout() {
        $resource(baseUrl + '/logout').get().$promise
            .then(function (result) {
                console.log(result);
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

            })
            .catch(function (error) {
                console.log(error);
                UtilsService.makeToast('יציאה נכשלה', $rootScope.rootToastAnchor, 'top right');
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            });
    }

    function signup(user) {
        return $resource(baseUrl + '/signup').save({
            user: JSON.stringify(user)
        });
    }

    function authenticate(action) {
        return $resource(baseUrl + '/authenticate/:action').get({action: action});
    }
    function resetPassword(email,newPassword) {
        return $resource(baseUrl + '/forgot').save({
            email: email,
            new_password:newPassword,
            old_password:""
        });

    }
    function changePassword(email,newPassword,oldPassword) {
        return $resource(baseUrl + '/forgot').save({
            email: email,
            new_password:newPassword,
            old_password:oldPassword
        });

    }
    

    return {
        deletePhoto : deletePhoto,
        signup: signup,
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        authenticate: authenticate,
        resetPassword : resetPassword,
        changePassword:changePassword
    };
});
