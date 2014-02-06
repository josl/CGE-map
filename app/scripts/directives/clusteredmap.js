'use strict';

angular.module('cgeMapApp')
  .directive('clusteredMap', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        // Watch the scope variable "isolates" to load the content.          
        scope.$watch('isolates', function (newVal, oldVal) { 
          if (newVal !== oldVal){  
            var url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            var map = new L.Map(element[0], 
              {center: [parseFloat(attrs.lat), parseFloat(attrs.long)], 
              zoom: 3}).addLayer(new L.TileLayer(url));
            // Add the map to the scope so its visible when updating
            scope.map = map;
            map.addLayer(scope.markers);
            //scope.legend.addTo(map);              
          }
        }); 
      }
  }
});
