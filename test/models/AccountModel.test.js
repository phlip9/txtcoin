'use strict';

var expect = require('chai').expect;
var mongoFake = require('../mongoFake.js');
var AccountModel = require('../../models/AccountModel.js');

describe('AccountModel', function () {

  before(mongoFake.start);
  after(mongoFake.stop);

  it('should add an account and return a promise', function (done) {
    AccountModel.createAsync({
      guid: '1234-abcd',
      address: '13ZzkBWuSGestmdtgAFvAH1hqSFhLcf7Xh',
      password: '1234567asdfghj',
      phone: '+12345678901',
      qrurl: ''
    }).then(function (account) {
      expect(account.guid).to.equal('1234-abcd');
      done();
    }).catch(function (err) {
      throw new Error();
    });
  });

});
