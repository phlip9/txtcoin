var mongoose = require("mongoose");
var API_Code = "";

// Schema and Model
var accountSchema = mongoose.Schema({
  guid: String,
  address: String,
  password: String,
  phone: String
});

var accountModel = mongoose.model("accounts", accountSchema);

// Database Connection
var connected = false;
var connectToMongoDB = function(callback, obj, next) {
    if (!connected) {
        var path = process.env.MONGOHQ_URL + "/";
//        var path = "mongodb://localhost/wepay";
        console.log("Try Connecting %s", path);
        mongoose.connect(path);
        mongoose.connection.on("error", function() {
            console.error.bind("[Model] Connection Failed: ");
            connected = false;
        });
        mongoose.connection.once("open", function() {
            console.log("[Model] Connection Success!!! PATH: %s", path);
            connected = true;
            if (callback) {
                callback(obj, next);
            } else {
                console.error("[Model] No Callback Specified");
            }
        });
    }
};

var createWallet = function(password) {

};

module.exports = {

};
