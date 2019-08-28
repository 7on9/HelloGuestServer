let router = require('express').Router();
let Guest = require('../controllers/guest');
let Utility = require("../common/utility");
let Cloudinary = require("../controllers/cloudinary");
router
  //verify data before call this api
  .get("/", (req, res, next) => {
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Guest.getAllGuestsOfAccount(account._id, (err, guests) => {
          if (guests) {
            res.status(200).send({
              success: true,
              allGuests: guests
            })
          } else {
            res.status(404).send({
              success: false
            })
          }
        })
      } else {
        res.status(401).send({
          success: false
        });
      }
    })
  })
  .get("/:id", (req, res, next) => {
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Guest.getGuestOfAccount(account.guests, req.params.id, (err, guest) => {
          if (guest) {
            res.status(200).send({
              success: true,
              guestInfo: guest
            })
          } else {
            res.status(404).send({
              success: false
            })
          }
        })
      } else {
        res.status(401).send({
          success: false
        });
      }
    })
  })
  .post("/", (req, res, next) => {
    let newGuest = JSON.parse(req.body.newGuest);
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Cloudinary.upload(newGuest.img, (err, url) => {
          if (err) {
            res.status(500).send({
              success: false
            })
          } else {
            newGuest.img = url;
            Guest.createGuest(account._id, newGuest, (err, guests) => {
              if (!err) {
                res.status(200).send({
                  success: true,
                  allGuests: guests
                })
              } else {
                res.status(500).send({
                  success: false
                })
              }
            })
          }
        })
      } else {
        res.status(401).send({
          success: false
        });
      }
    })
  })
  .post("/longcreate", (req, res, next) => {
    console.log(req.body.newGuest)
    let {newGuest} = req.body
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Guest.createGuest(account._id, newGuest, (err, guests) => {
          if (!err) {
            res.status(200).send({
              success: true,
              allGuests: guests
            })
          } else {
            res.status(500).send({
              success: false
            })
          }
        })
      }
    })
  })
  .post("/update", (req, res, next) => {
    let guest = JSON.parse(req.body.guest);
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        if (guest.img) {
          Cloudinary.upload(guest.img, (err, url) => {
            if (err) {
              res.status(500).send({
                success: false
              })
            } else {
              guest.img = url;
              Guest.updateGuest(account._id, guest, (err, guests) => {
                if (!err) {
                  res.status(200).send({
                    success: true,
                    allGuests: guests
                  })
                } else {
                  res.status(500).send({
                    success: false
                  })
                }
              })
            }
          })
        } else {
          Guest.updateGuest(account._id, guest, (err, guests) => {
            if (!err) {
              res.status(200).send({
                success: true,
                allGuests: guests
              })
            } else {
              res.status(500).send({
                success: false
              })
            }
          })
        }
      } else {
        res.status(401).send({
          success: false
        });
      }
    })
  })
  .post("/delete", (req, res, next) => {
    console.log('Ok');
    if (req.headers.token) {
      console.log('Ok');
      Utility.verifyToken(req.headers.token, (err, account) => {
        if (account) {
          Guest.deleteGuest(account._id, req.body.idGuest, (err, guests) => {
            if (!err) {
              res.status(200).send({
                success: true,
                allGuests: guests
              })
            } else {
              res.status(500).send({
                success: false
              })
            }
          })
        } else {
          res.status(401).send({
            success: false
          });
        }
      })
    } else {
      res.status(401).send({
        success: false
      });
    }
  })

module.exports = router;