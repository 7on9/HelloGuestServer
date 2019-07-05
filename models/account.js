let DB = require("../common/constant/database");
let mongoose = require('mongoose');
let Guest = require('./guest');
let Meeting = require('./meeting');

let accountSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  gender: Boolean,
  organization: String,
  phone: String,
  guests: [Guest.schema],
  deleted: Boolean
}, { collection: DB.COLLECTIONS.ACCOUNT });

module.exports = mongoose.model(DB.COLLECTIONS.ACCOUNT, accountSchema);