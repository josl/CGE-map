'use strict';

describe('Service: Groupisolatesbycity', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Groupisolatesbycity;
  beforeEach(inject(function (_Groupisolatesbycity_) {
    Groupisolatesbycity = _Groupisolatesbycity_;
  }));

  it('should do something', function () {
    expect(!!Groupisolatesbycity).toBe(true);
  });

});
