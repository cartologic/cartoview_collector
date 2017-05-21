/**
 * Created by kamal on 7/2/16.
 */

angular.module('cartoview.collectorApp').controller('cartoview.collectorApp.MainController',
    function ($scope, mapService, $mdSidenav, $mdMedia, $mdDialog, appConfig, collectorService,cartoviewUser) {
        $scope.config = appConfig;
        $scope.authenticated = cartoviewUser.isAuthenticated;
        $scope.toggleSidenav = function () {
            return $mdSidenav('left').toggle();
        };
        $scope.map = mapService.map;
        $scope.collectorService = collectorService;
        $scope.getIdentifier = function () {
            return featureListService.appConfig.id + "-" + featureListService.selected.getId();
        };
        $scope.mobile = false;
        $scope.mapShow = true;
        if (window.innerWidth <= 800) {
            $scope.mobile = true;
        }
        else {
            $scope.mobile = false;
        }
        $(window).on("resize.doResize", function () {

            $scope.$apply(function () {
                if (window.innerWidth <= 800) {
                    $scope.mobile = true;
                }
                else {
                    $scope.mobile = false;
                    $scope.mapShow = true;
                }
            });
        });
        $scope.showhideList = function () {
            $scope.mapShow = !$scope.mapShow
        };
        $scope.closeSidenav = function () {
            $mdSidenav('left').close();
        };
        $scope.closeSidenavNew = function () {
            $mdSidenav('new').close();
        };


    });