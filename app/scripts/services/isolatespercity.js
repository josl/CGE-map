'use strict';

angular.module('cgeMapApp')
  .service('Isolatespercity', function Isolatespercity() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    this.group = function (isolates) {
      
      console.log(isolates);
      
    }
    
  });
