var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var request = require('request');

var getTransactions = require('../../models/TransactionModel.js').getTransactions;

var sampleData = {
  "send": {
    "txrefs": [
      {
        "tx_hash": "86eea68a218602d9ac05b0afa84f137a31a92668b1b68a46cfc4d5218a0b4261",
        "block_height": 328248,
        "tx_input_n": 0,
        "tx_output_n": -1,
        "value": 89002,
        "spent": false,
        "confirmations": 487,
        "confirmed": "2014-11-02T23:01:09Z",
        "double_spend": false
      },
      {
        "tx_hash": "86eea68a218602d9ac05b0afa84f137a31a92668b1b68a46cfc4d5218a0b4261",
        "block_height": 328248,
        "tx_input_n": -1,
        "tx_output_n": 1,
        "value": 9002,
        "spent": false,
        "confirmations": 487,
        "confirmed": "2014-11-02T23:01:09Z",
        "double_spend": false
      }
    ]
  }, "receive": {
    "txrefs": [
      {
        "tx_hash": "5a75e43c5c6dc0eb0f8c843a4b380bbc76459b83fc3a0eb8107918db847cb4d8",
        "block_height": 328141,
        "tx_input_n": -1,
        "tx_output_n": 0,
        "value": 100000,
        "spent": true,
        "spent_by": "118a63429a0b3a52ef6d13ab1d91e032a57db6914bec1a7cc76de104084ee0ed",
        "confirmations": 594,
        "confirmed": "2014-11-02T07:13:06Z",
        "double_spend": false
      }
    ]
  }
};

describe('TransactionModel', function () {
  describe('#getTransactions', function () {
    var stub_get = function (data) {
      sinon
        .stub(request, 'get')
        .yields(null, null, JSON.stringify(data));
    };

    it('should parse a simple send transaction', function (done) {
      stub_get(sampleData.send);
      var txns = getTransactions('foo', function (results) {
        expect(results).to.eql([
          { type: 'send', amount: 0.0008 }
        ]);
        request.get.restore();
        done();
      });
    });

    it('should parse a simple receive transaction', function (done) {
      stub_get(sampleData.receive);
      var txns = getTransactions('foo', function (results) {
        expect(results).to.eql([
          { type: 'receive', amount: 0.001 }
        ]);
        request.get.restore();
        done();
      });
    });
  });
});
