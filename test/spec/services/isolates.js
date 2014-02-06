'use strict';

describe('Service: Isolates', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Isolates;
  beforeEach(inject(function (_Isolates_) {
    Isolates = _Isolates_;
  }));

  it('should do something', function () {
    expect(!!Isolates).toBe(true);
  });

});
