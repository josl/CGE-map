'use strict';

angular.module('cgeMapApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  //'leaflet-directive'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/clusteredmap_3.html',
        controller: 'ClusteredmapCtrl'
      })
      .when('/clusteredMap', {
        templateUrl: 'views/clusteredmap_3.html',
/*         templateUrl: 'views/rename.html', */
        controller: 'ClusteredmapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
