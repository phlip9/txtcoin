var proxyquire = require('proxyquire').noCallThru();

var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var sms = proxyquire('../../controllers/SMSController.js', {
  '../models/BlockChainModel.js': {}
});

describe('SMSController', function () {
  describe('#parse_message', function () {
    it('should parse a message and call the associated command', function () {
      var spy = sinon.spy();
      sms.commands.help = spy;
      sms.parse_message('+12345678901', 'help create_account');
      assert(spy.withArgs('+12345678901', ['create_account']).calledOnce);
    });
  });
});
