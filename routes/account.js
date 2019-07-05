let router = require('express').Router();
let Account = require('../controllers/account');
let Utility = require("../common/utility");

router
  //verify data before call this api
  .post("/register", (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
      res.status(400).send({
        success: false,
        error: "QUERY_ERROR"
      })
    } else {
      Account.register(req.body.email, req.body.password, req.body.username, (error, result) => {
        if (error) {
          res.status(400).send({
            success: false,
            detail: error
          });
        } else {
          res.status(201).send({
            success: true
          })
        }
      })
    }
  })
  .post("/login", (req, res, next) => {
    Account.login(req.body.email, req.body.password, (error, result) => {
      if (error || !result) {
        res.status(401).send({
          success: false
        });
      } else {
        // Account.updateToken(req.body.email, req.body.password, result);
        res.status(200).send({
          success: true,
          token: result,
          email: req.body.email.toLowerCase()
        });
      }
    })
  })
  .post("/logout", (req, res, next) => {
    Utility.verifyToken(req.headers.token, (err, account) => {
      Account.logout(account.email, (error, result) => {
        if (error || !result) {
          res.status(404);
        } else {
          res.status(401);
        }
      })
    })
  })
  .post("/verify", async (req, res, next) => {
    if(req.headers.token){
      Utility.verifyToken(req.headers.token, (err, account) => {
        if (account) {
          res.status(201).json({
            success: true,
            token: req.headers.token,
            email: account.email
          })
        } else {
          res.status(401).send({
            success: false
          })
        }
      });
    }
  })
  .get("/info", async (req, res, next) => {
    let getUserByToken = await Utility.getUserByToken(req.headers.token);
    if (getUserByToken) {
      res.status(200).json({
        success: true,
        detail: getUserByToken
      });
    } else {
      res.status(401).send({
        success: false,
        detail: "UnAuthorized"
      });
    }
  })
  .post("/info", async (req, res, next) => {
    let getUserByToken = await Utility.getUserByToken(req.headers.token);
    if (getUserByToken) {
      Account.update(req.body, (err, updated) => {
        if (err) {
          res.status(401).json({
            success: false,
            detail: "query error"
          });
        } else {
          res.status(200).json({
            success: true,
            detail: "Updated"
          });
        }
      })
    } else {
      res.status(401).send({
        success: false,
        detail: "UnAuthorized"
      });
    }
  })
  .delete("/delete", (req, res, next) => {
    Account.deleteAccount(req.headers.token, (error, result) => {
      if (error) {
        res.status(401).json({
          success: false,
          detail: "UnAuthorized"
        });
      } else {
        res.status(200).json({
          success: true,
          detail: "Deleted"
        });
      }
    })
  })

module.exports = router;