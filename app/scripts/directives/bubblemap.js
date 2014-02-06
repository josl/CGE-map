'use strict';

angular.module('cgeMapApp')
  .directive('bubbleMap', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the bubbleMap directive');
      }
    };
  });
