var mongoose = require("mongoose");
var request = require("request");
var rpg = require("rpg");
var API_CODE = "8a1efaba-63bf-43f6-bd3e-e8ce934c6ef6";

// Schema and Model
var accountSchema = mongoose.Schema({
  guid: String,
  address: String,
  password: String,
  phone: Stringgit
});

var accountModel = mongoose.model("accounts", accountSchema);

// export functions

/**
 * Query the database for the account with phone number
 * and give back the account object by invoking the callback
 *
 * @param phone {schartring} the phone number
 * @param callback {function} a callback function with 1 parameter
 */
var getAccount = function(phone, callback) {
  accountModel.findOne({phone: phone}, function(err, account) {
    if (err) {
      console.error(err);
    } else {
      if (callback) {
        callback(account);
      }
    }
  });
};

/**
 * Send a request to the BlockChain server to create a Wallet and
 * save the account information of the Wallet in the database
 *
 *
 * @param phone {string} the phone number
 */
var createWallet = function(phone) {
  // create password
  var password = rpg({length: 16, set: 'lud'});

  // create url
  var url = "https://blockchain.info/api/v2/create_wallet";
  url += "?password=" + password;
  url += "&api_code=" + API_CODE;
  console.log("[Model] Fetching %s", url);

  // check to see if account already exists
  accountModel.findOne({phone: phone}, function(err, already_exist) {
    if (err) {
      console.error(err);
    } else if (already_exist) {
      console.log("[MongoDB] Account already exists:");
      console.log(already_exist);
      throw "Shit! Account already exists!";
    } else {
      // send the request to blockchain server
      request.post(url, function(err, httpResponse, body){
        if (err) {
          console.error(err);
        } else {
          console.log("[Model] Wallet is created:");
          body = JSON.parse(body);
          console.log(body);

          // save the account in the database
          accountModel.create({
            guid: body.guid,
            address: body.address,
            password: password,
            phone: phone
          }, function(err, account) {
            if (err) {
              console.error(err);
            } else {
              console.log("[MongoDB] Account is saved:");
              console.log(account);
            }
          });
        }
      });
    }
  });
};

/**
 * Send a request to the BlockChain server to get the balance
 * and give it back by invoking the callback
 *
 * @param phone {string} the phone number
 * @param callback {function} a callback function with 1 parameter
 */
var getBalance = function(phone, callback) {
  getAccount(phone, function(account) {
    var url = "https://blockchain.info/merchant/";
    url += account.guid + "/balance?password=" + account.password;
    console.log("[Model] Fetching %s", url);

    request.get(url, function(err, httpResponse, balance) {
      if (err) {
        console.error(err);
      } else {
        balance = JSON.parse(balance);
        console.log("[Model] Balance is found: %s", balance);
        console.log(balance);
        if (callback) {
          callback(balance.balance);
        }
      }
    });
  });
};

/**
 * Send a request to the BlockChain server to make a payment
 * to the account who has the target_address the amount of satoshi
 *
 * @param phone {string} the phone number
 * @param target_address {string} the address of the target
 * @param amount {number} the amount of satoshi to pay
 */
var makePaymentByAddress = function(phone, target_address, amount) {
  // TODO: Modify this function
  getAccount(phone, function(account) {
    url = "https://blockchain.info/merchant/";
    url += account.guid + "/payment?password=" + account.password;
    url += "&to=" + target_address + "&amount=" + amount;
    console.log("[Model] Fetching %s", url);

    request.post(url, function(err, httpResponse, message) {
      if (err) {
        console.error(err);
      } else {
        message = JSON.parse(message);
        console.log("[Model] Payment successful: %s", message);
      }
    });
  });
};

/**
 * Send a request to the BlockChain server to make a payment
 * to the account who has phone number target_phone the amount of satoshi
 *
 * @param phone {string} the phone number
 * @param target_phone {string} the phone number of the target
 * @param amount {number} the amount of satoshi to pay
 */
var makePaymentByPhone = function(phone, target_phone, amount) {
  getAccount(phone, function(account) {
    getAccount(target_phone, function(target_account) {
      url = "https://blockchain.info/merchant/";
      url += account.guid + "/payment?password=" + account.password;
      url += "&to=" + target_account.address + "&amount=" + amount;
      console.log("[Model] Fetching %s", url);

      request.post(url, function(err, httpResponse, message) {
        if (err) {
          console.error(err);
        } else {
          message = JSON.parse(message);
          console.log("[Model] Payment successful: %s", message);
        }
      });
    })
  });
};

module.exports = {
  getAccount: getAccount,
  createWallet: createWallet,
  getBalance: getBalance,
  makePaymentByAddress: makePaymentByAddress,
  makePaymentByPhone: makePaymentByPhone
};
