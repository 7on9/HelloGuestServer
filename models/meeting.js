let DB = require("../common/constant/database");
let mongoose = require('mongoose');
let Guest = require('./guest');

let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

let meetingSchema = new mongoose.Schema({
  idOwner: ObjectId,
  name: String,
  welcomeTitle: String,
  address: String,
  guestsInvited: [Guest.schema],
  guestAttended: [ObjectId],
  timeLine: [Number],
  code: Number,
  time: Number,
  decription: String,
  status: Number,
  deleted: Boolean
}, { collection: DB.COLLECTIONS.MEETING });

module.exports = mongoose.model(DB.COLLECTIONS.MEETING, meetingSchema);