var express = require("express");
var routes = express.Router();

let guestRouter = require('./routes/guest')
let accountRouter = require('./routes/account')
let meetingRouter = require('./routes/meeting')
routes
    .use("/guest", guestRouter)
    .use("/account", accountRouter)
    .use("/meeting", meetingRouter)
module.exports = routes;

