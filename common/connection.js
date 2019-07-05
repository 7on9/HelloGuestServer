let DB = require("./constant/database");
const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect()
  }
  _connect() {
    mongoose.connect(DB.URL.RELEASE,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error : ' + err)
      })
  }
}

module.exports = new Database()