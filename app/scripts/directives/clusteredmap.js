'use strict';

angular.module('cgeMapApp')
  .directive('clusteredMap', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        
        // Create Map
        var url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        var map = new L.Map(element[0],{
                        center: [parseFloat(attrs.lat), parseFloat(attrs.long)], 
                        zoom: 3
                      }).addLayer(new L.TileLayer(url));
          
        // Add the map to the scope so its visible when updating
        scope.map = map;

        // Use Leaflet to implement a D3 geometric transformation.
        // Here is visible to both watch functions
        var projectPoint = function (x, y) {
          var point = scope.map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }
        
        // Functions for d3 transformation. Visible to both watch functions
        var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform).pointRadius(10); 
              
              
        // WATCH FUNCTIONS
              
        // Watch the scope variable "isolates" to load the content.          
        scope.$watch('isolates', function (newVal, oldVal) { 
          if (newVal !== oldVal){  
            
            //map.addLayer(scope.markers);

            // Create SVG elements
            var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("id"," "),
                g = svg.append("g").attr("class", "leaflet-zoom-hide");
                      
            var collection = {"type":"FeatureCollection","features":newVal},
                bounds = path.bounds(collection);
          
            var feature = g.selectAll(".circle_path")
                .data(collection.features)
              .enter().append("path").attr("class","circle_path");
                                   
            // Reposition the SVG to cover the features.
            var reset = function () {
              
              var bounds = path.bounds(collection),
                  padding = 100, // Extra padding for circle radius
                  topLeft = bounds[0],
                  bottomRight = bounds[1],
                  topLeft = [topLeft[0] - padding, topLeft[1] - padding],
                  bottomRight = [bottomRight[0] + padding, bottomRight[1] + padding];
              
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
          
            //map.on("viewreset", reset);
            map.on("moveend", reset);
            map.on("zoomend", reset);
            map.on("focus", reset);
            reset();
          
          }
        });
        
        // Listener functions to hide/show clusters and svg circles
        // TODO: ...
        scope.$watch('isolate_group', function (newVal, oldVal) {
          if (newVal !== oldVal){ 
            // Group isolates according to the filter
            if (newVal == 'id'){
              var data = scope.isolates;
            }else if (newVal == 'city'){
            
              console.log(scope.isolates);
              
            }else if (newVal == 'country'){
              console.log(scope.isolates);
            }
            var collection = {"type":"FeatureCollection","features":scope.isolates};
            
            var feature = d3.selectAll(".circle_path")
                .data(collection.features);
            
            // Update
            feature.attr("d", path)
                    .append("title")
                    .text(function(d){
                      return d.properties.data.City;
                    });            
            // Enter
            
            // Exit                        
          }
        });                                  
      }              
  }
});
