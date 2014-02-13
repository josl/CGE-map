'use strict';

angular.module('cgeMapApp')
  .service('Citygroup', function Citygroup() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    this.create = function (isolates) {
      
      var isolates_by_city = d3.nest()
                  .key(function(d){ return d.properties.data.City; })
                  //.map(isolates, d3.map);
                  .rollup(function(d){

                    return {"type":"Feature","id":1,
                      "properties":{
                        "size": d.length,
                        "city": d[0].properties.data.City,
                        "country": d[0].properties.data.Country
                      },"geometry":{
                          "type":"Point",
                          "coordinates": d[0].geometry.coordinates
                        }
                    };       
                  })
                  .map(isolates, d3.map);
                  
      return isolates_by_city.values();
      
    }
    
  });
