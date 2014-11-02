var expect = require('chai').expect;

describe('Math', function () {
  describe('#max', function () {
    it('returns the largest number from the arguments', function () {
      expect(Math.max(1, 2, 3, 2)).to.equal(3);
    });
  });
});
