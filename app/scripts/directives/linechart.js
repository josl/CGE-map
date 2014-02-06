'use strict';

angular.module('cgeMapApp')
  .directive('lineChart', function () {
    return {
      templateUrl: 'templates/lineChartTemplate.html',
      restrict: 'EA',
      transclude: true,
      scope: { id:'@id', name:'@name', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){        
            // Structure of newVal (data needed for the visualization    
            // newVal = [min_year, max_year, dateDimension, dateGroupPatho, dateGroupNonPatho, dateGroupUnk]
            // ...
                        
            var pathLineChart = dc.compositeChart("#patho-line");
            
            // Pathogenic evolution over time
            pathLineChart
              .width(1100)
              .height(100)
              .elasticY(true)
              .brushOn(false)
              .mouseZoomable(true)
              //.rangeChart(rangeChart)
/*
              .x(d3.time.scale().domain(
                  [new Date(newVal[0].getUTCFullYear(), newVal[1].getUTCMonth(), 1), 
                   new Date(newVal[0].getUTCFullYear(), newVal[1].getUTCMonth(), 31)]))
*/
              .x(d3.time.scale().domain([newVal[0], newVal[1]]))                   
              .round(d3.time.day)
              .xUnits(d3.time.days)
              .dimension(newVal[2])
              .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
            .compose([
              dc.lineChart(pathLineChart)
                .renderArea(true)
                .transitionDuration(1000)
                .margins({top: 30, right: 20, bottom: 25, left: 10})
                .dimension(newVal[2])
                .mouseZoomable(true)
                .colors(["#6BF536"])
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
                .brushOn(false)
                .group(newVal[4], "Non Pathogenic")
                .valueAccessor(function (d) {
                    return d.value;
                }),
              // when creating sub-chart you need to pass in the parent chart
               dc.lineChart(pathLineChart)
                .renderArea(true)
                .transitionDuration(1000)
                .margins({top: 30, right: 20, bottom: 25, left: 10})
                .dimension(newVal[2])
                .mouseZoomable(true)
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
                .brushOn(false)
                .colors(["#EF6922"])
                .group(newVal[3], "Pathogenic")
                .valueAccessor(function (d) {
                    return d.value;
                }),
                dc.lineChart(pathLineChart)
                  .renderArea(true)
                  .transitionDuration(1000)
                  .margins({top: 30, right: 20, bottom: 25, left: 10})
                  .dimension(newVal[2])
                  .mouseZoomable(true)
                  .colors(["#0E64F5"])
                  .renderHorizontalGridLines(true)
                  .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
                  .brushOn(false)
                  .group(newVal[5], "Unknown")
                  .valueAccessor(function (d) {
                      return d.value;
                  })
                ]);
              
              pathLineChart.render();  

            // Update Line chart with the time line range chart
/*
            pathLineChart.on("postRender", function(chart){
              console.log(2);
              // rewrote postRender
              pathLineChart.on("postRender", function(){});
              var timeLine = dc.barChart("#time-line-all");
              pathLineChart.rangeChart(timeLine);
              pathLineChart.render();
              
            });  
*/            
              
          } 
        });
      }
    };
  });
