let express = require("express");
let bodyparser = require("body-parser");
let app = express();

//mongoDb 
let db = require("./common/connection");

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

let routes = require('./routes');

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // let allowedOrigins = ['http://localhost:4200', 'http://localhost:3330', "https://xcdc.herokuapp.com/", "http://xcdc.ueuo.com/"];
    // let origin = req.headers.origin;
    // if (allowedOrigins.indexOf(origin) > -1) {
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    // }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, Content-Security-Policy");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/', routes);

module.exports = app;
// console.log(module);

