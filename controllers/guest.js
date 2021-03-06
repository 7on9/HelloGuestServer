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
    let guest = guests.find(val => val._id.toString() == idGuest);
    if (guest) {
      return callback(null, guest);
    } else {
      return callback(err, null);
    }
  },
  createGuest: (accountId, guest, callback) => {
    let newGuest = new Guest({
      name: guest.name,
      address: guest.address || "1",
      imagePath: guest.img || "1",
      gender: guest.gender || "1",
      dob: guest.dob || "1",
      department: guest.department || "1",
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
  updateGuest: (accountId, guest, callback) => {
    Account
      .findById(accountId)
      .exec((err, account) => {
        if (account) {
          let pos = account.guests.findIndex((gue, id) => {
            return (gue._id.toString() == guest._id.toString())
          })
          if (pos != -1) {
            if (guest.img) {
              account.guests[pos].imagePath = guest.img
            }
            account.guests[pos].name = guest.name;
            account.guests[pos].address = guest.address;
            // account.guests[pos].imagePath = guest.img;
            account.guests[pos].gender = guest.gender;
            account.guests[pos].dob = guest.dob;
            account.guests[pos].department = guest.department;
          }
          // account.guests.push(newGuest);
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