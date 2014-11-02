var client = require('twilio')('ACe7faf8ca4cbaa71c9862e4a73f93574b', '8c6edb56e262e61e1614d7d8b0561552');
var blockchain = require('../models/BlockChainModel.js');

/**
 * Send an sms message to a receiving phone number
 *
 * @param {string} recipient - The phone number to receive the message
 * @param {string} message - The message to send
 */
var send_sms = function (recipient, message) {
  console.log('[send_sms] Sending SMS: [ to:', recipient, ']', message);
  client.sendSms({
    from: '+14156912236',
    to: recipient,
    body: message
  }, function (err, responseData) {
    if (!err) {
      console.log('[send_sms] SMS message to', recipient, 'was successfully received');
    } else {
      console.error('[send_sms] Error sending SMS message to', recipient);
      console.error('[send_sms] responseData:', JSON.stringify(responseData));
    }
  });
};

var send_mms = function (recipient, message, media_url) {
  console.log('[send_mms] Sending MMS: to:', recipient, ', message:', message, ', media url:', media_url);
  client.sendMms({
    from: '+14156912236',
    to: recipient,
    body: message,
    MediaUrl: media_url
  }, function (err, responseData) {
    if (!err) {
      console.log('[send_mms] MMS message to', recipient, 'was successfully received');
    } else {
      console.error('[send_mms] Error sending MMS message to', recipient);
    }
    console.error('[send_mms] responseData:', JSON.stringify(responseData));
  });
};

var btc_regex = /[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/;

/**
 * Converts amount in some unit to satoshis (100000000 Satoshi = 1 BTC)
 *
 * @param {string} unit - The units to convert from (BTC, cBTC, mBTC, Bit, satoshi);
 * @param {number} amount
 */
var convert_to_satoshi = function (unit, amount) {
  unit = unit.toUpperCase();

  if (unit === 'BTC') {
   return ~~(amount * 100000000);
  } else if (unit === 'CBTC') {
   return ~~(amount * 1000000);
  } else if (unit === 'MBTC') {
   return ~~(amount * 100000);
  } else if (unit === 'BIT') {
   return ~~(amount * 100);
  } else {
   return ~~(amount);
  }
};

var commands = {
  /**
   * Sends the user a list of all commands
   *
   *     commands
   */
  commands: function (sender, args) {
    var res = "Commands: help [command] | create_account | ";
    res += "balance | send [amount] [BTC/cBTC/mBTC] to [phone number] | ";
    res += "request [amount] [BTC/cBTC/mBTC] from [phone number]";
    send_sms(sender, res);
  },
  /**
   * Sends the user help on a given command
   *
   *     help <command>
   */
  help: function (sender, args) {
    var res = "";
    switch(args[0]) {
      case "create_account":
        res = "Command \'create_account\' will create a BTC wallet";
        res += " and link that wallet with your phone number";
        break;
      case "send":
        res = "Command \'send\' will send the designated amount of BTC to ";
        res += "the account associated with the phone number you specified ";
        res += "or the BTC address, e.g. \'send 0.05 BTC to +12345678901\'";
        res += " \'send 0.05 BTC to 1A8JiWcwvpY7tAopUkSnGuEYHmzGYfZPiq\'";
        break;
      case "balance":
        res = "Command \'balance\' will show you the balance of your ";
        res += "current BTC account"
        break;
      case "request":
        res = "Command \'request\' will ask the account holder who has ";
        res += "the designated phone number to pay you the amount of ";
        res += "BTC you specified, e.g.";
        res += " \'request 0.1 BTC from +10987654321\'"
        break;
    }
    console.log(res);
    send_sms(sender, res);
  },

  /**
   * Creates a bitcoin wallet associated with a phone number
   *
   *     create_account
   */
  create_account: function (sender, args) {
    blockchain.createWallet(sender, function (account, error) {
      if (!error) {
        send_sms(sender, 'Created new account! BTC Address: ' + account.address);
      } else {
        console.error(error)
        send_sms(sender, error);
      }
    });
  },

  /**
   * Sends the user their current bitcoin wallet balance
   *
   *     balance
   */
  balance: function (sender, args) {
    blockchain.getBalance(sender, function (balance, error) {
      if (!error) {
        balance = balance / 100000000;
        send_sms(sender, 'Current balance: ' + balance + ' BTC');
      } else {
        console.log(error)
        send_sms(sender, error)
      }
    });
  },

  /**
   * Send bitcoins to a phone number / bitcoin address
   *
   *     send <amount> <units> <recipient>
   */
  send: function (sender, args) {
    // TODO: Error Handling
    var amount = args[0];
    var unit = args[1];
    var receiver = args[3];

    var satoshis = convert_to_satoshi(unit, amount);

    var cb = function (receiver) {
      send_sms(sender, 'Payment sent successfully!');
      if (receiver) {
        send_sms(receiver, sender + ' sent you ' + amount + ' BTC!');
      }
    };

    console.log('Sending', amount, 'to', receiver, 'from', sender);
    if (receiver.match(btc_regex)) {
      blockchain.makePaymentByAddress(sender, receiver, satoshis, cb);
    } else { // assume phone number
      blockchain.makePaymentByPhone(sender, receiver, satoshis, cb);
    }
  },

  /**
   * Sends the user an MMS qr code image of the BTC address
   *
   *     qrcode
   */
  qrcode: function (sender, args) {
    blockchain.getAccount(sender, function (account) {
      var qrcode_url = account.qrurl;
      console.log('QR Code url for', sender, ':', qrcode_url);
      send_mms(sender, '', qrcode_url);
    });
  },

  /**
   * Regenerates the user's QR code
   *
   *     regen_qrcode
   */
  regen_qrcode: function (sender, args) {
    blockchain.regenQRCode(sender, function (url) {
      console.log("QR Code updated! %s", url);
      send_mms(sender, "QR Code updated!", url);
    });
  },

  /**
   * Request bitcoins from a phone number
   *
   *     request <amount> <phone number>
   */
  request: function (sender, args) {
    var amount = args[0];
    var unit = args[1];
    var provider = args[3];

    amount = convert_to_satoshi(unit, amount);

    blockchain.getAccount(provider, function(account) {
      var res = sender + ' requested you to send him ' + amount + ' BTC';
      send_mms(provider, res);
    });
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
    args = args.slice(1);
    console.log('[parse_message]', command, args);
    command_fn(sender, args);
  } else {
    var error = 'Error: ' + command + ' is an invalid command, ';
    error += 'try typing commands or help [command]';
    console.error(error);
    send_sms(sender, error);
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

  console.log('[receive_sms]');
  console.log(JSON.stringify(body));

  var sender = body.From;
  var message = body.Body;

  parse_message(sender, message);

  res.end();
};

module.exports = {
  commands: commands,
  parse_message: parse_message,
  send_sms: send_sms,
  send_mms: send_mms,
  receive_sms: receive_sms,
  convert_to_satoshi: convert_to_satoshi,
};
