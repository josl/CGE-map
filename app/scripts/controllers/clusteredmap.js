'use strict';

angular.module('cgeMapApp')
    .controller('ClusteredmapCtrl', 
      ['$scope', 'Isolates', 'Markers',function ($scope, Isolates, Markers) {

        // Initial load of the isolates data            
        $scope.getIsolates = Isolates.getData().success(function(answer){   

            // Preprocess Influenza Data
            $scope.markers = new L.MarkerClusterGroup();
            $scope.isolates = [];
            $scope.filter = {data:[], type:''};
            
            // Service to create the markers
            var markers = Markers.createAll(answer);
            
            // Legend for the colors
            $scope.legend = L.control({position: 'bottomright'});
            $scope.legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info_legend legend'),
                    grades = ["Pathogenic", "Non Pathogenic", "Unknown"],
                    colors = ["#6BF536","#EF6922","#0E64F5"];
                // Generates a square for each of the elements in grades
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<img class="marker_legend" src='+markers_src[i]+'>' +
                        grades[i] + '<br>';
                }
                return div;
            };
            $scope.markers.addLayers(markers.markerList);
            $scope.markersList = markers.markerList;

            /* Create Crossfilter Data */
            var ndx = crossfilter(markers.isolates);
            var all = ndx.groupAll();
            
            // Dimensions and groups
                            
              // Countries
            var countries = ndx.dimension(function (d) {
                return d.properties.data.Country;
            });
            $scope.countries = [countries, countries.group()];
              // Sources
            var sources = ndx.dimension(function (d) {
                return d.properties.data.Sources;
            });
            $scope.sources = [sources, sources.group()];
              // Genus
            var genus = ndx.dimension(function (d) {
                return d.properties.data.Genus;
            });   
            $scope.genus = [genus, genus.group()];         
              // Species
            var species = ndx.dimension(function (d) {
                return d.properties.data.Species;
            });
            $scope.species = [species, species.group()];
              //  Pathogenic
            var pathogenic = ndx.dimension(function (d) {
              if (d.properties.data.Pathogenic == "Yes"){
                return "Pathogenic";
              }else if (d.properties.data.Pathogenic == "No"){
                return "Non Pathogenic";
              }else{
                return "Unknown";
              }
            });
            $scope.pathogenic = [pathogenic, pathogenic.group()];
                                    
              //  Time
            var formatWeek = d3.time.format("%w"),
                formatMonth = d3.time.format("%m"),
                formatDay = d3.time.format("%d");
              
            var dateDimension = ndx.dimension(function (d) {
                return d.properties.data.Date;
                //return d.properties.data.month;
            });
            var dateDimensionGroup = dateDimension.group();

              // Year bounds
            var max_year = d3.max(markers.isolates,function(d){
                return d.properties.data.Date;
            });
            var min_year = d3.min(markers.isolates,function(d){
                return d.properties.data.Date;
            });
            
              // Pathogenity over time
            var dateGroupPatho = dateDimensionGroup
                    .reduceSum(function(d) { return (d.properties.data.Pathogenic == "Yes") });
            var dateGroupNonPatho = dateDimensionGroup
                    .reduceSum(function(d) { return (d.properties.data.Pathogenic == "No"); });
            var dateGroupUnk = dateDimensionGroup
                    .reduceSum(function(d) { return (d.properties.data.Pathogenic == "Unknown"); });
            
            $scope.pathogenity = [
              min_year, max_year, dateDimension, dateGroupPatho, dateGroupNonPatho, dateGroupUnk
            ];

              // Time Line                
            // Counts by day of the week
            var byDays = ndx.dimension(function (d) {
                return formatWeek(d.properties.data.Date);              
            }); 
            var byDaysGroup = byDays.group();  

            // Counts by month of the year
            var byMonths = ndx.dimension(function (d) {
                return formatMonth(d.properties.data.Date)-1;
            }); 
            var byMonthsGroup = byMonths.group(Math.floor); 
            
            $scope.timeline = [
              min_year, max_year, dateDimension, dateDimensionGroup,
              byDays, byDaysGroup,
              byMonths, byMonthsGroup
            ];
                        
            // Finally we update the scope variable isolates
            $scope.isolates = markers.isolates;
              
                
        }, function() {
            return 'error';
        });
        
        // Watch if any filter applies to update the markers on the map
        $scope.$on("updateMap",function (newVal, oldVal){
          if (newVal != oldVal){
            console.log(newVal);
            // Remove the old markers
            $scope.markers.clearLayers();          
            var coordinates = [55.4, 12.34];          
            var data = $scope.countries[0].top(Infinity);

            if (data.length != $scope.isolates.length){ 
              if ($scope.filter.type == "country"){
                // Get the coordinates to focus the map on the last country
                var country = $scope.filter.data[$scope.filter.data.length-1];
                for (var i=0; i< data.length; i++){
                  if (data[i].properties.data.Country == country){
                    coordinates = [data[i].properties.data.Latitude, 
                                    data[i].properties.data.Longitude]; 
                    break;
                  } 
                }
              }          
              var markerList = Markers.createMarkers(data); // return markerList
              $scope.markers.addLayers(markerList);           
            }else{
              // Retrieve the old markers
              $scope.markers.addLayers($scope.markersList);
            }
            // Add the markers layer
            $scope.map.addLayer($scope.markers);
            // Center the map
            //console.log(coordinates);
            $scope.map.setView(coordinates,3);        
          }
        });

    }]);
