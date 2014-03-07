'use strict';

angular.module('cgeMapApp')
  .directive('pieChart', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: { id:'@id', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){
            // Pie of countries
            var pieChart = dc.pieChart(element[0]);
            var color_scale =  d3.scale.category20b();
            var countries = d3.nest()
                .key(function(d) { return d.key; })
                .map(scope.data[1].all(), d3.map).keys();


            pieChart
              .width(170)
              .height(170)
              .radius(80)
              .innerRadius(10)
              .dimension(scope.data[0])
              .group(scope.data[1])
              .label(function (d) {
                  return d.data.key;
              })
              .renderLabel(true)
              .colors(d3.scale.category20c())
              .colorDomain(countries)
              .colorAccessor(function(d, i){return i;})
              .on("filtered", function(chart, filter){
                // Filter the points in the map with the filter 
                if(chart.filters()) {
                  var countries = chart.filters();
                  scope.$parent.filter.data = countries; 
                  scope.$parent.filter.type = 'country'; 
                  scope.$emit("updateMap");
                }           
              });
                          
            // Render chart
            pieChart.render();
          } 
        });
      }
    };
  });
