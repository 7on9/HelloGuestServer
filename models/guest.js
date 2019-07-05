let DB = require("../common/constant/database");
let mongoose = require('mongoose');

let guestSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
  address: String,
  gender: Boolean,
  dob: Number,
  department: String,
  seat: Number,
  attendance: Boolean
});

module.exports = mongoose.model(DB.COLLECTIONS.GUEST, guestSchema);