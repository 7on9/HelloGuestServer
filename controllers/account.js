let Account = require('../models/account');
let crypto = require('crypto')
let Utility = require('../common/utility');

let isExistEmail = (email) => {
  return new Promise((resolve, reject) => {
    Account.find({
      "email": email,
      "deleted": false
    }, (err, res) => {
      if (err) {
        resolve(false)
      }
      if (res.length == 0) {
        resolve(true);
      } else
        resolve(false);
    });
  })
}

accounts = {
  register: async (email, password, username, callback) => {
    email = email.toLowerCase();
    let isEmailUseable = await isExistEmail(email);
    if (!isEmailUseable) {
      err = 'email has been used';
      return callback(err, null);
    } else {
      password = crypto.createHash('sha256').update(password).digest('hex');
      let newAccount = new Account({
        email: email,
        username: username,
        password: password,
        gender: null,
        organization: '',
        guests: [],
        meeting: [],
        phone: '',
        deleted: false
      });
      newAccount.save()
        .then(res => callback(null, res))
        .catch(err => callback(err, null));
    }
  },
  login: async (email, password, callback) => {
    password = crypto.createHash('sha256').update(password).digest('hex');
    email = email.toLowerCase();
    Account.findOne({
      email: email,
      password: password,
      deleted: false
    }, (err, res) => {
      if (res != null) {
        let token = Utility.getToken(res.email);
        if (token) {          
          return callback(null, token[0]);
        } else {
          Utility.computingJWT(email, (err, newToken) => {
            Utility.addNewTokenForAccount(email, newToken);
            return callback(null, newToken);
          })
        }
      } else {
        callback(err, null);
      }
    })
  },
  logout: async (email, callback) => {
    Utility.removeTokenForAccount(email);
  },
  updateInfo: (account, callback) => {
    account.password = crypto.createHash('sha256').update(account.password).digest('hex');
    Account.findById(account._id, (err, oldAccount) => {
      oldAccount.username = account.name;
      oldAccount.password = account.password;
      oldAccount.gender = account.gender;
      oldAccount.organization = account.organization;
      oldAccount.phone = account.phone;
      oldAccount.save()
        .then(res => callback(null, res))
        .catch(err => callback(err, null));
    })
  },
  deleteAccount: (token, callback) => {
    Account.findOne({
      "token": token
    }, (err, doc) => {
      if (doc) {
        doc.token = "";
        doc.deleted = true;
        doc.save()
          .then(res => callback(null, res))
          .catch(err => callback(err, null));
      } else {
        callback(true, null);
      }
    });
  },

}
module.exports = accounts;

