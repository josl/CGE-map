'use strict';

describe('Service: Groupisolates', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Groupisolates;
  beforeEach(inject(function (_Groupisolates_) {
    Groupisolates = _Groupisolates_;
  }));

  it('should do something', function () {
    expect(!!Groupisolates).toBe(true);
  });

});
