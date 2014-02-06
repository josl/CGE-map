'use strict';

angular.module('cgeMapApp')
  .factory('isolatesNepal', ['$http', function ($http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      getData: function () {
            var promise = $http({
                method: 'GET',
                url:'http://localhost:8888/cge/map/getIsolatesDT.php',
                cache: true,
                headers: 'application/json'
            }).
/*
            success(function(data){
                //console.log(data);
                return data;
            }).
*/
            error(function (data, status) {
                if (status === 404) {
                    console.log('That repository does not exist');
                } else {
                    console.log('Error: ' + status);
                }
            })/*
.
            then(function(data){
                console.log(data);
                return data;
            })*/
            ; 
            
            return promise;

      }
    };
  }]);

