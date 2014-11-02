var cloudinary = require('cloudinary');
var qr = require('qr-image');

var create_send_qr = function (btc_addr, callback) {
  var link = 'bitcoin://' + btc_addr + '?amount=0';
  console.log('Creating QR Code with link', link);
  var qr_png = qr.image(link, { type: 'png' });
  var upload_stream = cloudinary.uploader.upload_stream(function (res) {
    console.log('Finished uploading qr code', res.url);
    if (callback) {
      callback(res.url);
    }
  });
  qr_png.pipe(upload_stream);
};

module.exports = create_send_qr;
