var client = require('twilio')('ACe7faf8ca4cbaa71c9862e4a73f93574b', '8c6edb56e262e61e1614d7d8b0561552');

var send_sms = function (recipient, message) {
  client.sendMessage({
    to: to,
    body: message
  });
};

var commands = {
  help: function (sender, args) {
  
  },

  create_account: function (sender, args) {

  },

  balance: function (sender, args) {

  },

  send: function (sender, args) {

  },

  request: function (sender, args) {

  },

  add_funds: function (sender, args) {

  },

  transactions: function (sender, args) {

  },

  address: function (sender, args) {

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

  var message = body.from;

  var args = message.split(' ');
  var command = split[0];
  var command_fn = commands[command];
  if (command_fn) {
    command_fn(sender, args.slice(1));
  } else {
    send_sms(sender, 'Error: ' + command + ' is an invalid command');
  }

  res.end();
};

module.exports = {
  'send_sms': send_sms,
  'receive_sms': receive_sms
};
