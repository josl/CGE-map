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
            //map.addLayer(scope.markers);
            
            // Create SVG circles
            var svg = d3.select(map.getPanes().overlayPane).append("svg"),
                g = svg.append("g").attr("class", "leaflet-zoom-hide");   
                         
            // Reposition the SVG to cover the features.
            var reset = function () {
              var topLeft = bounds[0],
                  bottomRight = bounds[1];
          
              svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");
        
              g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
          
              feature.attr("d", path)
                      .append("title")
                      .text(function(d){
                        return d.properties.data.City;
                      });
            }
          
            // Use Leaflet to implement a D3 geometric transformation.
            var projectPoint = function (x, y) {
              var point = map.latLngToLayerPoint(new L.LatLng(y, x));
              this.stream.point(point.x, point.y);
            }            
            var collection = {"type":"FeatureCollection","features":newVal},
                transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform).pointRadius(15),
                bounds = path.bounds(collection);
          
            var feature = g.selectAll(".circle_path")
                .data(collection.features)
              .enter().append("path").attr("class","circle_path");
          
            map.on("viewreset", reset);
            reset();
          
          }
        });
        
        // Listener functions to hide/show clusters and svg circles
        // TODO: ...
         
      }
  }
});
