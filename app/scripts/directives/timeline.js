'use strict';

angular.module('cgeMapApp')
  .directive('timeLine', function () {
    return {
      templateUrl: 'templates/timeLineChartTemplate.html',
      restrict: 'EA',
      transclude: true,
      scope: { id:'@id', name:'@name', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){    
            
            // Structure and data in newVal
            // newVal= [
            //  min_year, max_year, 
            //  dateDimension, dateDimensionGroup,
            //  byDays, byDaysGroup,
            //  byMonths, byMonthsGroup
            // ]; 

            var days_names = d3.map({0:"mo", 1:"tu", 2:"we", 3:"thu",4:"fri", 5:"sat", 6:"sun"});
            var month_names = d3.map({0:"ja", 1:"fe", 2:"mar", 3:"ap",4:"ma", 5:"jun", 6:"jul"
                                    , 7:"au", 8:"se", 9:"oc", 10:"no", 11:"de"});

            var timeLine = dc.barChart("#time-line-all");
            var timeLineDay = dc.barChart("#time-line-day");
            var timeLineMonth = dc.barChart("#time-line-month"); 
                        
            // TIMELINE (General)
            timeLine.width(603)
                .height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 10})
                .dimension(newVal[2])
                .group(newVal[2].group())
                //.centerBar(true)
                .gap(14)
                .x(d3.time.scale().domain([newVal[0], newVal[1]]))
                .round(d3.time.day.round)
                .xUnits(d3.time.days)
                .on("filtered", function(chart, filter){
                    // Filter the points in the map with the filter 
                    if(chart.filter()) {
                        var dates = chart.filter(); 
                        scope.$parent.filter.data = dates;
                        scope.$parent.filter.type = 'date';
                    }
                    scope.$emit("updateMap");           
                });
        
            //  ------> TIMELINE DAY
            timeLineDay.width(140)
                .height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 10})
                .dimension(newVal[4])
                .group(newVal[5])
                //  .centerBar(true)
                .gap(14)
                .x(d3.scale.linear().domain([0, 7]))
                .on("filtered", function(chart, filter){
                    // Filter the points in the map with the filter 
                    if(chart.filter()) {
                        var dates = chart.filter(); 
                        scope.$parent.filter.data = dates;
                        scope.$parent.filter.type = 'date_day';
                    }    
                    scope.$emit("updateMap");       
                })
                .xAxis().tickFormat(function(d, i){
                  return days_names.get(i);
                })                ;
        
            //  ------> TIMELINE Month
            timeLineMonth.width(230)
                .height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 10})
                .dimension(newVal[6])
                .group(newVal[7])
                //.centerBar(true)
                .gap(4)
                .x(d3.scale.linear().domain([0, 12]))
                .on("filtered", function(chart, filter){
                    // Filter the points in the map with the filter 
                    if(chart.filter()) {
                        var dates = chart.filter(); 
                        scope.$parent.filter.data = dates;
                        scope.$parent.filter.type = 'date_month';  
                    }
                    scope.$emit("updateMap");   
                })
                .xAxis().tickFormat(function(d, i){
                  return month_names.get(i);
                });
                                                         
            timeLine.render();
            timeLineDay.render();
            timeLineMonth.render();   
            
            // Hide the y axis in 
            d3.select("#time-line-chart").selectAll("g.y").style("display","none");
            
            // Listener function to event: "reset timeline dimension"
            scope.resetDimension = function(dimension){
              dimension.filterAll();
              dc.redrawAll();
              scope.$parent.filter.data = []; 
              scope.$parent.filter.type = scope.id.split("-")[0]; 
              scope.$emit("updateMap"); 
            }                        
          } 
        });
      }
    };
  });
