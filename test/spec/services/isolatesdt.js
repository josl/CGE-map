'use strict';

describe('Service: isolatesDT', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var isolatesDT;
  beforeEach(inject(function (_isolatesDT_) {
    isolatesDT = _isolatesDT_;
  }));

  it('should do something', function () {
    expect(!!isolatesDT).toBe(true);
  });

});
