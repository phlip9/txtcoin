'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = require('chai').expect;

var btc_utils = require('../btc_utils.js');

describe('btc_utils', function () {
  describe('#convert_to_satoshi', function () {
    it('should convert BTC -> satoshi', function () {
      expect(btc_utils.convert_to_satoshi('BTC', 0.0000123)).to.equal(1230);
    });
    it('should convert mBTC -> satoshi', function () {
      expect(btc_utils.convert_to_satoshi('mBTC', '123')).to.equal(12300000);
    });
    it('should convert string amount', function () {
      expect(btc_utils.convert_to_satoshi('BTC', '0.0000123')).to.equal(1230);
    });
  });
});
