'use strict';

var request = require('request');
var lodash = require('lodash');

var simplifyTxns = function (txns) {
  if (txns.length === 1) {
    // Probably Receive TXN
    var txn = txns[0];

    if (txn.tx_input_n === -1 && txn.tx_output_n === 0) {
      return {
        type: 'receive',
        amount: txn.value / 100000000,
        timestamp: txn.confirmed
      };
    } else {
      console.error('Error: Invalid Receive Transaction');
      return null;
    }
  } else {
    // Probably Send TXN
    var change_txn = lodash.find(txns, function (txn) {
      return txn.tx_input_n === -1 && txn.tx_output_n === 1;
    });
    var total_txn = lodash.find(txns, function (txn) {
      return txn.tx_input_n === 0 && txn.tx_output_n === -1;
    });

    if (change_txn && total_txn) {
      return {
        type: 'send',
        amount: (total_txn.value - change_txn.value) / 100000000,
        timestamp: total_txn.confirmed
      };
    } else {
      console.error('Error: Invalid Send Transaction');
      return null;
    }
  }
};

var parseTxns = function (data) {
  return lodash(data)
    .groupBy('tx_hash')
    .mapValues(simplifyTxns)
    .omit(lodash.isUndefined)
    .values()
    .value();
};

var getTransactions = function(address, callback) {
  var url = "http://api.blockcypher.com/v1/btc/main/addrs/" + address;
  request.get(url, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      console.log(body);
      body = JSON.parse(body);
      callback(parseTxns(body.txrefs));
    }
  });
};

module.exports = {
  getTransactions: getTransactions
};
