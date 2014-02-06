'use strict';

describe('Directive: bubbleMap', function () {

  // load the directive's module
  beforeEach(module('cgeMapApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bubble-map></bubble-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bubbleMap directive');
  }));
});
