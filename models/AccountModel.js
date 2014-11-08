'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

// Schema and Model
var accountSchema = mongoose.Schema({
  guid: String,
  address: String,
  password: String,
  phone: String,
  qrurl: String
});

var getModel = function () {
  var AccountModel;
  try {
    AccountModel = mongoose.model('accounts', accountSchema);
  } catch (e) {
    AccountModel = mongoose.model('accounts');
  }

  AccountModel = Promise.promisifyAll(AccountModel);
  return AccountModel;
};

module.exports = getModel();
