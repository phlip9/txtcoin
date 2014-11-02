var SMSController = require('./controllers/SMSController.js');

var router = function(app) {
  app.post('/sms/twilio', SMSController.receive_sms);
};

module.exports = router;
