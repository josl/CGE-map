'use strict';

angular.module('cgeMapApp')
  .service('Groupisolates', function Groupisolates() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.create = function (isolates, criteria) {
      
      // Min and Max isoltes per criteria
      var group_size = [];
      
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
                    return {"type":"Feature","id":1,
                      "properties": {
                        "data":{
                          "size": d.length,
                          "city": d[0].properties.data.City,
                          "country": d[0].properties.data.Country
                        }
                      },"geometry":{
                          "type":"Point",
                          "coordinates": d[0].geometry.coordinates
                        }
                    };       
                  })
                  .map(isolates, d3.map);

      return [grouped_isolates.values(), d3.max(group_size), d3.min(group_size)];
      
    }    
  });
