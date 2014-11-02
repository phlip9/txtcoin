var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var SMSController = require('../../controllers/SMSController.js');

describe('SMSController', function () {
  describe('#parse_message', function () {
    it('should call the help command', function () {
      var spy = sinon.spy();
      SMSController.commands.help = spy;
      SMSController.parse_message('+12345678901', 'help create_account');
      expect(spy.withArgs('+12345678901', ['create_account']).calledOnce);
    });
  });
});
