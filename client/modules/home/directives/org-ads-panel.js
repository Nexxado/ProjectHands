angular.module('ProjectHands.home')

    .directive('orgAdsPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/home/templates/directives/org-ads-panel.html',
            controller: orgAdsPanelController
        };

    });

function orgAdsPanelController($scope, $mdDialog, $mdMedia, HomeService) {

    $scope.ad = {
        title: '',
        content: ''
    };
    $scope.ads = [];
    $scope.getAds = function () {
        HomeService.getAds()
            .then(function (result) {
                $scope.ads = result;
            })
            .catch(function (error) {
            });
    };
    $scope.getAds();

    $scope.upload = function (title, content) {

        if ($scope.adsForm.$invalid)
            return;

        HomeService.uploadAd(title, content)
            .then(function (result) {
                $scope.ads.push(result.ops[0]);
                resetForm();
            })
            .catch(function (error) {
            });
    };
    function resetForm() {
        $scope.ad = {
            title: '',
            content: ''
        };
    }
    $scope.deleteAd = function (id, index) {
        HomeService.deleteAd(id)
            .then(function (result) {
                $scope.ads.splice(index, 1);

            })
            .catch(function (error) {
            });
    };


    $scope.editAd = function($event, ad, index) {
        var isMobile = $mdMedia('sm') || $mdMedia('xs');

        $mdDialog.show({
            controller: editAdController,
            templateUrl: '/modules/home/templates/dialogs/edit-ad.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: isMobile,
            locals: {
                ad: angular.copy(ad)
            }
        })
            .then(function (result) {
                console.log('dialog result', result);
                $scope.ads[index] = result;

            }, function () {
                //Dialog Canceled
            });
    }
}


function editAdController($scope, $mdDialog, ad, HomeService) {

    $scope.ad = angular.copy(ad);

    /**
     * Cancel dialog, abort any changes made.
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function () {

        if($scope.EditAdForm.$invalid)
            return;

        if(angular.equals($scope.ad, ad))
            return $mdDialog.cancel();

        HomeService.editAd($scope.ad).$promise
            .then(function(result) {
                console.log('EditAd result', result);
                $mdDialog.hide($scope.ad);
            })
            .catch(function(error) {
                console.error('EditAd error', error);
            });

    };
}
