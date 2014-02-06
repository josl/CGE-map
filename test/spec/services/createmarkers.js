'use strict';

describe('Service: Createmarkers', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Createmarkers;
  beforeEach(inject(function (_Createmarkers_) {
    Createmarkers = _Createmarkers_;
  }));

  it('should do something', function () {
    expect(!!Createmarkers).toBe(true);
  });

});
