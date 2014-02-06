'use strict';

angular.module('cgeMapApp')
  .directive('attributePicker', function () {
    return {
      templateUrl: 'templates/attibutePickerTemplate.html',
      restrict: 'E',
      transclude: true,
      scope: { id:'@id', name:'@name', data:'=data' },
      //scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function (newVal, oldVal) {   
          if (newVal != oldVal){
            scope.elements = newVal[1].all();
            scope.dimension = newVal[0];
          } 
        });
      }
    };
  });
