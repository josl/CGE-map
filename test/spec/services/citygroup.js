'use strict';

describe('Service: Citygroup', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Citygroup;
  beforeEach(inject(function (_Citygroup_) {
    Citygroup = _Citygroup_;
  }));

  it('should do something', function () {
    expect(!!Citygroup).toBe(true);
  });

});
