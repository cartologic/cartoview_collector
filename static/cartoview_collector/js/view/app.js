var collectorApp = angular.module('cartoview.collectorApp', ['cartoview.featureListApp','cartoview.userInfo']);
collectorApp.config(function($httpProvider){
    $httpProvider.useApplyAsync(true);
});