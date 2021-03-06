let CLOUDINARY_CONFIG = require('../common/constant/cloudinary');

let cloudinary = require('cloudinary').v2;

cloudinary.config(CLOUDINARY_CONFIG);

module.exports = {
  upload: (imageBase64, callback) => {
    cloudinary.uploader.upload(imageBase64, (err, image) => {
      if (err) {
        return callback("ERROR", null);
      } else {
        return callback(null, image.url);
      }
    })
  }
}