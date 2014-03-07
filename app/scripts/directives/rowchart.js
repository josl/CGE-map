'use strict';

angular.module('cgeMapApp')
  .directive('rowChart', function () {
    return {
      templateUrl: 'templates/rowChartTemplate.html',
      restrict: 'EA',
      transclude: true,
      scope: { id:'@id', name:'@name', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){            
            var pathRowChart = dc.rowChart("#path-chart");
            // Pathogenic bar chart distribution
            pathRowChart
              .height(130)
              .width(180)
              .margins({top: 10, right: 10, bottom: 20, left: 10})
              .group(scope.data[1])
              .dimension(scope.data[0])   
              .colors(["#6BF536","#EF6922","#0E64F5"])     
              .label(function (d) { return d.key; })
              .title(function (d) { return d.value;})
              .elasticX(true)
              .on("filtered", function(chart, filter){
                // Filter the points in the map with the filter 
                if(chart.filters()) {
                  //var countries = chart.filters();
                  //scope.$parent.filter.data = countries; 
                  //scope.$parent.filter.type = 'country'; 
                  scope.$emit("updateMap");
                }           
              })              
              .xAxis().ticks(10);              
              
              pathRowChart.render();     
          } 
        });
      }
    };
  });
