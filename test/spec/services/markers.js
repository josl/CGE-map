'use strict';

describe('Service: Markers', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var Markers;
  beforeEach(inject(function (_Markers_) {
    Markers = _Markers_;
  }));

  it('should do something', function () {
    expect(!!Markers).toBe(true);
  });

});
