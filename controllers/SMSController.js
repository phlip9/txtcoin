var client = require('twilio')('ACe7faf8ca4cbaa71c9862e4a73f93574b', '8c6edb56e262e61e1614d7d8b0561552');
var model = require('../model.js');

/**
 * Send an sms message to a receiving phone number
 *
 * @param {string} recipient - The phone number to receive the message
 * @param {string} message - The message to send
 */
var send_sms = function (recipient, message) {
  client.sendMessage({
    to: to,
    body: message
  });
};

var commands = {
  /**
   * Sends the user help on a given command
   *
   *     help <command>
   */
  help: function (sender, args) {
  
  },

  /**
   * Creates a bitcoin wallet associated with a phone number
   *
   *     create_account <password> [<address>]
   */
  create_account: function (sender, args) {

  },

  /**
   * Sends the user their current bitcoin wallet balance
   *
   *     balance
   */
  balance: function (sender, args) {

  },

  /**
   * Send bitcoins to a phone number / bitcoin address
   *
   *     send <amount> <recipient>
   */
  send: function (sender, args) {

  },

  /**
   * Request bitcoins from a phone number
   *
   *     request <amount> <phone number>
   */
  request: function (sender, args) {

  },

  /**
   * Send the last 3 transactions to the user
   *
   *     transactions
   */
  transactions: function (sender, args) {

  },

  /**
   * Send the user their bitcoin wallet
   *
   *     address
   */
  address: function (sender, args) {

  }
};

var parse_message = function (sender, message) {
  var args = message.split(' ');
  var command = args[0];
  var command_fn = commands[command];
  if (command_fn) {
    command_fn(sender, args.slice(1));
  } else {
    send_sms(sender, 'Error: ' + command + ' is an invalid command');
  }
};

/**
 * Called when a message is received.
 *
 * @param req - Node request object
 * @param res - Node response object
 */
var receive_sms = function (req, res) {
  var body = req.body;

  console.log(JSON.stringify(body));

  var sender = body.From;
  var message = body.Body;

  parse_message(sender, message);

  res.end();
};

module.exports = {
  'commands': commands,
  'parse_message': parse_message,
  'send_sms': send_sms,
  'receive_sms': receive_sms
};
