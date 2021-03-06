let Meeting = require('../models/meeting');
let Account = require('../models/account');
let Utility = require('../common/utility');
let EVENT = require('../common/constant/eventSocket');

let meeting = {
  createNewMeeting: async (accountId, meeting, callback) => {
    let newMeeting = new Meeting({
      idOwner: accountId,
      name: meeting.name,
      welcomeTitle: meeting.welcomeTitle,
      guestsInvited: meeting.guestsInvited,
      address: meeting.address,
      guestAttended: [],
      timeLine: [],
      code: null,
      time: meeting.time,
      duration: meeting.duration,
      decription: meeting.decription,
      status: -1, //-1 not started yet 0 attending 1 ended
      deleted: false
    });
    newMeeting.save()
      .then((resMeeting) => {
        return callback(null, resMeeting);
      })
      .catch(err => {
        console.log(err);
        return callback(new Error(EVENT.ERROR.NOT_EXIST))
      })
  },
  startMeeting: (idMeeting, callback) => {
    Meeting.findOne({
      _id: idMeeting,
      status: -1,
      deleted: false
    }, (err, meeting) => {
      if (meeting) {
        meeting.status = 0;
        meeting.code = Utility.createMeetingCode(idMeeting);
        meeting.save()
          .then(meeting => callback(null, meeting));
      } else {
        callback(err, null)
      }
    })
  },
  getMeeting: (idMeeting, callback) => {
    Meeting.findOne({
      _id: idMeeting
    })
      .then((meeting) => callback(null, meeting))
      .catch(err => callback(err, null))
  },
  getMeetingOfAccount: (idOwner, idMeeting, callback) => {
    Meeting.findOne({
      idOwner: idOwner,
      _id: idMeeting
    })
      .then((meeting) => callback(null, meeting))
      .catch((err) => callback("NOT_EXIST", null))
  },
  getAllMeetings: (idOwner, callback) => {
    Meeting.find({
      idOwner: idOwner,
      deleted: false
    }, (err, meetings) => {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, meetings);
      }
    })
  },
  getAllGuestOfMeeting: (idMeeting, callback) => {
    Meeting.findById(idMeeting, (err, meeting) => {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, meeting.guestsInvited);
      }
    })
  },
  endMeeting: (idMeeting, attendance, callback) => {
    Meeting.findOne({
      _id: idMeeting
    }, (err, meeting) => {
      // meeting.guestAttended = attendance.guestAttended;
      // meeting.timeLine = attendance.timeLine;
      meeting.status = 1;
      meeting.code = null;
      meeting.save()
        .then(meeting => callback(null, meeting))
        .catch(err => callback(err, null));
    })
  },
  getGuest: (idGuest, emailAccount, callback) => {
    console.log(idGuest, emailAccount);
    try {
      let guest;
      Account.findOne({
        email: emailAccount
      }, (err, account) => {
        if (account) {
          let guests = Array.from(account.guests).map(v => v.toJSON());
          guest = guests.find(g => g._id.toString() == idGuest.toString())
        } else {
          guest = null;
          console.log(err)
        }
        return callback(null, guest);
      })
    } catch (error) {
      console.log(err);
      callback(err, null)
    }
  },
  attend: (codeMeeting, idGuest, emailAccount, callback) => {
    meeting.getGuest(idGuest, emailAccount, (err, guest) => {
      if (guest) {
        Meeting.findOne({
          code: codeMeeting
        }, (err, mee) => {
          if (mee) {
            console.log(mee);
            if (!mee.guestAttended.includes(idGuest.toString())) {
              mee.guestAttended.push(idGuest);
              mee.timeLine.push(Date.now() / 1000.0);
              mee.save()
                .then(callback(null, true))
                .catch(callback(true, null))
            } else {
              return callback(null, true);
            }
          } else {
            return callback(true, null)
          }
        })
      } else {
        return callback(true, null)
      }
    })
  },
  deleteMeeting: (idOwner, id, callback) => {
    Meeting.findOne({
      _id: id,
      idOwner: idOwner
    }, (err, meeting) => {
      if (meeting) {
        meeting.deleted = true;
        meeting.save()
          .then(res => callback(null, res))
          .catch(err => callback(err, null));
      } else {
        callback(true, null);
      }
    });
  }
}
module.exports = meeting;

