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
              .width(200)
              .margins({top: 10, right: 50, bottom: 30, left: 20})
              .group(scope.data[1])
              .dimension(scope.data[0])   
              .colors(["#6BF536","#EF6922","#0E64F5"])     
              .label(function (d) { return d.key; })
              .title(function (d) { return d.value;})
              .elasticX(true)
              .xAxis().ticks(10);
              
              pathRowChart.render();     
          } 
        });
      }
    };
  });