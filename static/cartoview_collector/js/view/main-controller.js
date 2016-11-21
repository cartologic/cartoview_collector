/**
 * Created by kamal on 7/2/16.
 */

angular.module('cartoview.collectorApp').controller('cartoview.collectorApp.MainController',
    function($scope, mapService, identifyService, $mdSidenav, $mdMedia, $mdDialog, appConfig, collectorService){
        $scope.config = appConfig;

        $scope.toggleSidenav = function() {
            return $mdSidenav('left').toggle();
        };
        $scope.map = mapService.map;
        $scope.identify = identifyService;
        $scope.collectorService = collectorService;

    });