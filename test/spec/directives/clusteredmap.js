'use strict';

describe('Directive: clusteredMap', function () {

  // load the directive's module
  beforeEach(module('cgeMapApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<clustered-map></clustered-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the clusteredMap directive');
  }));
});
