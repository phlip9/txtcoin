'use strict';

var mongoose = require('mongoose');
var mongoFake = require('mongodb-fs');

var config = {
  port: 1337,
  mocks: {
    fakedb: {
      accounts: []
    }
  },
  fork: true
};

var connected = false;

var start = function (done) {
  if (!connected) {
    mongoFake.init(config);
    mongoFake.start(function (err) {
      mongoose.connect('mongodb://localhost:' + config.port + '/fakedb', function (err) {
        connected = true;
        done();
      });
    });
  } else {
    done();
  }
};

var stop = function (done) {
  if (connected) {
    mongoose.disconnect(function (err) {
      mongoFake.stop(function (err) {
        connected = false;
        done();
      });
    });
  } else {
    done();
  }
};

module.exports = {
  start: start,
  stop: stop
};
