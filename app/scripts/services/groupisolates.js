'use strict';

angular.module('cgeMapApp')
  .service('Groupisolates', function Groupisolates() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.create = function (isolates, criteria) {
      
      // Min and Max isoltes per criteria
      var group_size = [];
      // Fake coordinates for countries and cities
      var countries = {
        "Astrakhan": [48.083333, 46.366667],
        "Cyprus": [33.366667, 35.166667],
        "Czech-Republic": [15.247307,49.816721],
        "Georgia": [43.614006,42.163403],
        "Guam": [144.765365,13.448395],
        "Finland": [27.458954,64.792848],
        "British-Columbia":[-127.580109,54.162434],
        "US": [-100.384827,39.774769] 
      };
      var cities = {
       "California":[-119.402847,37.26531], 
       "Alabama":[-86.903572,32.500496], 
       "Arizona":[-111.095467,34.270836],
       "Hawaii":[-155.569839,20.303418], 
       "Colorado":[-105.800056,39.83385], 
       "Delaware":[-75.520878,39.006379], 
       "Florida":[-81.521988,28.091366], 
       "Guam":[144.785278,13.470432], 
       "Georgia":[44.789543,41.705729], 
       "Helsinki":[24.941107,60.173506], 
       "Czech-Republic":[14.412346,50.078295], 
       "Cyprus":[33.365768,35.171844], 
       "British-Columbia":[-127.580109,54.162434], 
       "Astrakhan": [48.083618,46.379623]   
      };      
      var grouped_isolates = d3.nest()
                  .key(function(d){ 
                    if (criteria == 'city'){
                      return d.properties.data.City; 
                    }else if (criteria == 'country'){
                     return d.properties.data.Country; 
                    }  
                  })
                  //.map(isolates, d3.map);
                  .rollup(function(d){
                    group_size.push(d.length);
                    if (criteria == 'city'){
                      var criteria_coordinates = cities[d[0].properties.data.City];
                    }else if (criteria == 'country'){
                      var criteria_coordinates = countries[d[0].properties.data.Country]; 
                    }                      
                    return {"type":"Feature","id":-1,
                      "properties": {
                        "data":{
                          "Size": d.length,
                          "City": d[0].properties.data.City,
                          "City_coor": cities[d[0].properties.data.City],
                          "Country": d[0].properties.data.Country,
                          "Country_coor": countries[d[0].properties.data.Country],
                        }
                      },"geometry":{
                          "type":"Point",
                          // Coordinate of the first element... 
                          // should be the coordinate of the criteria
                          //"coordinates": d[0].geometry.coordinates 
                          "coordinates" : criteria_coordinates                         
                        }
                    };       
                  })
                  .map(isolates, d3.map);
      return [grouped_isolates.values(), d3.max(group_size), d3.min(group_size)];
      
    }    
  });
