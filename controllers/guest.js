let Account = require('../models/account')
let Guest = require('../models/guest')
let guests = {
  getAllGuestsOfAccount: (accountId, callback) => {
    Account
      .findById(accountId)
      .select('guests')
      .exec((err, res) => {
        if (res) {
          callback(null, res);
        } else {
          callback(err, null);
        }
      })
  },
  getGuestOfAccount: (guests, idGuest, callback) => {
    let guest = guests.find(val => val._id == idGuest);
    if(guest){
      return callback(null, guest);
    } else {
      return callback(err, null);
    }
  },
  createGuest: (accountId, guest, callback) => {
    let newGuest = new Guest({
      name: guest.name,
      address: guest.address,
      imagePath: guest.img,
      gender: guest.gender,
      dob: guest.dob,
      department: guest.department,
      seat: null,
      attendance: false
    });
    Account
      .findById(accountId)
      .exec((err, account) => {
        if (account) {
          account.guests.push(newGuest);
          account.save()
            .then(acc => {
              return callback(null, acc.guests);
            }).catch((err) => {
              return callback(err, null);
            });
        } else {
          return callback(err, null);
        }
      })
  },
  deleteGuest: (accountId, guestId, callback) => {
    Account
      .findById(accountId)
      .exec((err, account) => {
        if (account) {
          account.guests = account.guests.filter((guest) => guest._id != guestId);
          account.save()
            .then(acc => {
              return callback(null, acc.guests);
            }).catch((err) => {
              return callback(err, null);
            });
        } else {
          return callback(err, null);
        }
      })
  }
}
module.exports = guests;