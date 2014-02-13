'use strict';

describe('Service: Isolatespercity', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Isolatespercity;
  beforeEach(inject(function (_Isolatespercity_) {
    Isolatespercity = _Isolatespercity_;
  }));

  it('should do something', function () {
    expect(!!Isolatespercity).toBe(true);
  });

});
