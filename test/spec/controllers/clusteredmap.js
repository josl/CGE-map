'use strict';

describe('Controller: ClusteredmapCtrl', function () {

  // load the controller's module
  beforeEach(module('cgeMapApp'));

  var ClusteredmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClusteredmapCtrl = $controller('ClusteredmapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
