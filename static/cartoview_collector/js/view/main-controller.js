/**
 * Created by kamal on 7/2/16.
 */

angular.module('cartoview.collectorApp').controller('cartoview.collectorApp.MainController',
    function ($scope, mapService, $mdSidenav, $mdMedia, $mdDialog, appConfig, collectorService) {
        $scope.config = appConfig;

        $scope.toggleSidenav = function () {
            return $mdSidenav('left').toggle();
        };
        var basicStyle = {position: 'absolute', left: 'auto', right: '300px'};
        var movableStyle = {position: 'absolute', left: 'auto', right: '610px'};
        $scope.addLocationStyle = basicStyle;
        $scope.map = mapService.map;
        $scope.sideRight = true;
        $scope.collectorService = collectorService;
        $scope.closeCommentNav = function () {
            $mdSidenav('comment').close();
        };
        $scope.closeImageNav = function () {
            $mdSidenav('image').close();
        };
        $scope.commentNav = function () {
            if ($mdSidenav('image').isOpen()) {
                $mdSidenav('image').close();
                $mdSidenav('comment').toggle();


            } else {
                $mdSidenav('comment').toggle();

            }
        };
        $scope.imageNav = function () {
            if ($mdSidenav('comment').isOpen()) {
                $mdSidenav('comment').close();
                $mdSidenav('image').toggle();

            } else {
                $mdSidenav('image').toggle();
            }
        };


    });