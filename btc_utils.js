'use strict';

var btc_addr = require('bitcoin-address');

/**
 * Converts amount in some unit to satoshis (100000000 Satoshi = 1 BTC)
 *
 * @param {string} unit - The units to convert from (BTC, cBTC, mBTC, Bit, satoshi);
 * @param {number} amount
 */
var convert_to_satoshi = function (unit, amount) {
  unit = unit.toUpperCase();

  if (unit === 'BTC') {
   return Math.floor(amount * 100000000);
  } else if (unit === 'CBTC') {
   return Math.floor(amount * 1000000);
  } else if (unit === 'MBTC') {
   return Math.floor(amount * 100000);
  } else if (unit === 'BIT') {
   return Math.floor(amount * 100);
  } else {
   return Math.floor(amount);
  }
};

var btc_regex = /[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/;

/**
 * Returns true if the string looks like a bitcoin address string.
 *
 * @param {string} address - A bitcoin address
 */
var matches_btc_str = function (address) {
  return !!(address.matches(btc_regex));
};

/**
 * Verifies if a string is a bitcoin address.
 *
 * @param {string} address - A bitcoin address to verify
 */
var verify_address = function (address) {
  return btc_addr.verify(address);
};

module.exports = {
  convert_to_satoshi: convert_to_satoshi,
  matches_btc_str: matches_btc_str,
  verify_address: verify_address
};
