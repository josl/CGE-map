'use strict';

angular.module('cgeMapApp')
  .directive('clusteredMap', ['Groupisolates', function (Groupisolates) {
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
                path = d3.geo.path().projection(transform)
                              .pointRadius(function(d){
                                  return radius(d.properties.data.size);
                              });

        var radius = d3.scale.linear()
                      .domain([1, 1]) // updated later, when we know the isolates
                      .range([10, 50]);   
        
        var padding = 10; // Extra padding for circle radius
                          // visible for both watch functions
        var collection = {"type":"FeatureCollection","features":[]};
        
        // Reposition the SVG to cover the features.
        var reset = function () {
          
          var bounds = path.bounds(collection),
              topLeft = bounds[0],
              bottomRight = bounds[1],
              topLeft = [topLeft[0] - padding, topLeft[1] - padding],
              bottomRight = [bottomRight[0] + padding, bottomRight[1] + padding];
          
          d3.select("#svg_features").attr("width", bottomRight[0] - topLeft[0])
             .attr("height", bottomRight[1] - topLeft[1])
             .style("left", topLeft[0] + "px")
             .style("top", topLeft[1] + "px");
    
          d3.select(".leaflet-zoom-hide").attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
          
          var feature = d3.select(".leaflet-zoom-hide").selectAll(".circle_path");
          
          feature.attr("d", path);
        }                   
              
        // WATCH FUNCTIONS
              
        // Watch the scope variable "isolates" to load the content.          
        scope.$watch('isolates', function (newVal, oldVal) { 
          if (newVal !== oldVal){  
            
            //map.addLayer(scope.markers);

            // Create SVG elements
            var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("id","svg_features"),
                g = svg.append("g").attr("class", "leaflet-zoom-hide");
                      
            collection.features = newVal;
          
            var feature = g.selectAll(".circle_path")
                .data(collection.features)
              .enter().append("path").attr("class","circle_path");
                                   
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
            var data, max, min;
            if (newVal == 'id'){
              data = scope.isolates;
              max = 1; min = 1;
            }else if (newVal == 'city'){
              var answer = Groupisolates.create(scope.isolates, 'city');
              data = answer[0]; max = answer[1]; min = answer[2];
            }else if (newVal == 'country'){
              answer = Groupisolates.create(scope.isolates, 'country');
              data = answer[0]; max = answer[1]; min = answer[2];
            }
            radius.domain([min, max]);
            padding = radius(max);
            collection.features = data;    
            // Remove everything        
            d3.selectAll(".circle_path").remove();
            
            var feature = d3.select(".leaflet-zoom-hide").selectAll(".circle_path")
                            .data(collection.features);
            // Enter
            feature.enter().append("path")
                      .attr("class","circle_path");
            // Reposition new circles
            reset();
                                
          }
        });                                  
      }              
  }
}]);
