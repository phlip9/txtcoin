// required packages
var express = require("express");
var bodyParser = require("body-parser");
var setupRoutes = require('./route.js');
var cors = require('cors');
var mongoose = require('mongoose');

// set up app with middlewares
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// connect to database
var path = process.env.MONGOHQ_URL + "/txtcoin";
mongoose.connect(path);

mongoose.connection.on("error", function() {
    console.error.bind("[MongoDB] Connection Failed: ");
});

mongoose.connection.once("open", function() {
    console.log("[MongoDB] Connection Success!!! PATH: %s", path);
});


setupRoutes(app);

//Server Listening to Port
var server = app.listen((process.env.PORT || 5000), function(){
    console.log("[Server] Listening at %s", server.address().port);
});

module.exports = app;
