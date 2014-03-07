'use strict';

angular.module('cgeMapApp')
  .directive('attributePicker', function () {
    return {
      templateUrl: 'templates/attibutePickerTemplate.html',
      restrict: 'A',
      transclude: true,
      scope: { id:'@id', name:'@name', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){
            scope.elements = newVal[1].all();
            scope.dimension = newVal[0];
            scope.selected = scope.name;
            // Listener to event: "click on list element"
            scope.filterDimension = function(data){
              // Filter selected dimension
              scope.dimension.filter(data.key);
              // Redraw all the other charts
              dc.redrawAll();
              scope.$parent.filter.data = [data.key]; 
              scope.$parent.filter.type = scope.id.split("-")[0]; 
              scope.$emit("updateMap");   
              scope.selected = data.key;      
            }
            
            // Listener to event: "click on reset"
            scope.resetDimension = function(){
              scope.dimension.filterAll();
              dc.redrawAll();
              scope.$parent.filter.data = []; 
              scope.$parent.filter.type = scope.id.split("-")[0];
              
              scope.$emit("updateMap"); 
              scope.selected = scope.name;             
            }
          } 
        });
      }
    };
  });
