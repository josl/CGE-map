'use strict';

angular.module('cgeMapApp')
  .directive('clusteredMap', ['Groupisolates', 'Markers', function (Groupisolates, Markers) {
    return {
      //template: '<div></div>',
      restrict: 'E',
      //scope: true, //Creates a new scope but prototypically inherits from the parent scope.
      controller: function ($scope, $element, $attrs) {
        
        // ALL FUNCTIONS AND SCOPE VARIABLES SHOULD BE DECLARED HERE AND ATTACHED TO SCOPE
        // controller can expose an API, so...     
        
      },
      link: function (scope, element, attrs) {
        
        // LINK SHOULD WORK WITH DOM MANIPULATION!!!!! MEANING D3 GOES HERE
        // We have a "private" scope now. First attach variables and functions here
        
          //////// Scope variables
          
        // Create Map
        var url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        scope.map = new L.Map(element[0],{
                        center: [parseFloat(attrs.lat), parseFloat(attrs.long)], 
                        zoom: 3
                      }).addLayer(new L.TileLayer(url));
                      
        scope.padding = 10; // Extra padding for circle radius
        scope.geoJSON = {"type":"FeatureCollection","features":[]}; 
                 
          //////// Scope functions
          
        // Use Leaflet to implement a D3 geometric transformation.
        // Here is visible to both watch functions
        scope.projectPoint = function (x, y) {
          var point = scope.map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }

        scope.reset = function () {
          scope.update_bb();
          scope.feature.attr("d", scope.path);
        }
        
        // Reposition the SVG Bounding Box to cover the features.
        scope.update_bb = function (){  
          var bounds = scope.path.bounds(scope.geoJSON),
              topLeft = bounds[0],
              bottomRight = bounds[1],
              topLeft = [topLeft[0] - scope.padding, topLeft[1] - scope.padding],
              bottomRight = [bottomRight[0] + scope.padding, bottomRight[1] + scope.padding];
          
          scope.svg.attr("width", bottomRight[0] - topLeft[0])
             .attr("height", bottomRight[1] - topLeft[1])
             .style("left", topLeft[0] + "px")
             .style("top", topLeft[1] + "px");
    
          scope.g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        }                   

        // Redraw circles every time the map changes
/*
        scope.map.on("moveend", scope.reset);
        scope.map.on("zoomend", scope.reset);
        scope.map.on("focus", scope.reset);
*/

        scope.map.on("viewreset", scope.reset);

        scope.create_circles = function (data, criteria) {
          // Feature in scope so we don't select every time
          scope.feature = scope.g.selectAll(".circle_path")
                          .data(data, function(d){
                            // Key to join the data based on criteria
                            if (criteria == 'id'){
                              return d.id;
                            }else if (criteria == 'city'){
                              return d.properties.data.City + '-' + d.geometry.coordinates;
                            }else if (criteria == 'country'){
                              return d.properties.data.Country + '-' + d.geometry.coordinates;
                            }
                          });
                          
          // Update. Only in the case of filters applied   
          // when criteria changes, update selection is empty       
          scope.feature.transition().duration(1000).attr("d", scope.path);
          
          // Enter
          scope.feature.enter().append("path")
                    .attr("class","circle_path")
                    .transition().duration(1000)
                    .attr("d", scope.path);
          // Exit
          scope.feature.exit().remove();
        }
        
        // Functions for d3 transformation. Visible in the scope
        var transform = d3.geo.transform({point: scope.projectPoint});
        scope.path = d3.geo.path().projection(transform)
                              .pointRadius(function(d){
                                  return scope.radius(d.properties.data.Size);
                              });

        scope.radius = d3.scale.linear()
                      .domain([1, 1]) // updated later, when we know the isolates
                      .range([10, 50]);   

        scope.process_data = function (data, criteria) {
          var grouped_data, max, min;
          if (criteria == 'id'){
            grouped_data = data; max = 1; min = 1;
          }else if (criteria == 'city'){
            var answer = Groupisolates.create(data, 'city');
            grouped_data = answer[0]; max = answer[1]; min = answer[2];
          }else if (criteria == 'country'){
            answer = Groupisolates.create(data, 'country');
            grouped_data = answer[0]; max = answer[1]; min = answer[2];
          }
          scope.radius.domain([min, max]);
          scope.padding = scope.radius(max);
          scope.geoJSON.features = grouped_data;           
        }

        // WATCH FUNCTIONS
              
        // Watch the scope variable "isolates" to load the content.
        // Just executed once...          
        scope.$watch('isolates', function (newVal, oldVal) { 
          if (newVal !== oldVal){  
            
            scope.map.addLayer(scope.markers);

            // Create SVG elements
            scope.svg = d3.select(scope.map.getPanes().overlayPane).append("svg").attr("id","svg_features");
            scope.g = scope.svg.append("g").attr("class", "leaflet-zoom-hide");
                      
            scope.geoJSON.features = newVal;
            scope.create_circles(scope.geoJSON.features, 'id');
            scope.update_bb(); // Reposition new circles
            
            // First time
            //scope.svg.style("display", "none");
            $("#svg_features").css({"display" : "none"});            
          }
        });
        
        // Listener functions to hide/show clusters and svg circles
        
        // Every time the criteria changes
        scope.$watch('isolate_group', function (newVal, oldVal) {
          if (newVal !== oldVal){ 
            // Group isolates according to the criteria
            var data = scope.countries[0].top(Infinity); // Is listening to all the filters active at the moment 
            scope.process_data(data, newVal);           
            scope.create_circles(scope.geoJSON.features, newVal);            
            scope.update_bb(); // Reposition new circles
            
            //$("#grouping_button").
          }
        });
        
        // If a new filter is applied, update SVG circles
        // Watch if any filter applies to update the markers on the map
        scope.$on("updateMap",function (newVal, oldVal){
          if (newVal != oldVal){
            
            // Remove the old markers
            scope.markers.clearLayers();          
            var coordinates = [55.4, 12.34];   
            
            // Is listening to all the filters active at the moment        
            var data = scope.countries[0].top(Infinity);

            if (data.length != scope.isolates.length){ 
              // We've less countries => some filter has been applied
              if (scope.filter.type == "country"){
                // Get the coordinates to focus the map on the last country
                var country = scope.filter.data[scope.filter.data.length-1];
                for (var i=0; i< data.length; i++){
                  if (data[i].properties.data.Country == country){
                    coordinates = [data[i].properties.data.Latitude, 
                                    data[i].properties.data.Longitude]; 
                    break;
                  } 
                }
              }  
              // Markers        
              var markerList = Markers.createMarkers(data); // return just  markerList
              scope.markers.addLayers(markerList);                
            }else{
              // Retrieve the initial data
              scope.markers.addLayers(scope.markersList);             
            }
            // Add the markers layer
            scope.map.addLayer(scope.markers);
            // Center the map

            /*if (scope.filter.type == "country"){
              scope.map.setView(coordinates,3); 
            }*/

            scope.process_data(data, scope.isolate_group); 
            scope.create_circles(scope.geoJSON.features, scope.isolate_group);            
            scope.update_bb(); // Reposition new circles      
          }
        });
                                         
      }              
  }
}]);
