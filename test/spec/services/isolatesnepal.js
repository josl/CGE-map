'use strict';

describe('Service: isolatesNepal', function () {

  // load the service's module
  beforeEach(module('cgeMapApp'));

  // instantiate service
  var isolatesNepal;
  beforeEach(inject(function (_isolatesNepal_) {
    isolatesNepal = _isolatesNepal_;
  }));

  it('should do something', function () {
    expect(!!isolatesNepal).toBe(true);
  });

});
