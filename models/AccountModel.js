var mongoose = require("mongoose");

// Schema and Model
var accountSchema = mongoose.Schema({
  guid: String,
  address: String,
  password: String,
  phone: String,
  qrurl: String
});

var accountModel = mongoose.model("accounts", accountSchema);

module.exports = accountModel;
