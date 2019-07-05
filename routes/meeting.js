let router = require('express').Router();
let Meeting = require('../controllers/meeting');
let Utility = require("../common/utility");

router
  //get all meetings
  .get("/", (req, res, next) => {
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Meeting.getAllMeetings(account._id, (err, meetings) => {
          if (meetings) {
            res.status(200).send({
              success: true,
              allMeetings: meetings
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
  //get info meeting
  .get("/:id", (req, res, next) => {
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Meeting.getMeetingOfAccount(account._id, req.params.id, (err, meeting) => {
          if (meeting) {
            res.status(200).send({
              success: true,
              meetingInfo: meeting
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
  //create meeting
  .post("/", (req, res, next) => {
    let newMeeting = JSON.parse(req.body.newMeeting);
    Utility.verifyToken(req.headers.token, (err, account) => {
      if (account) {
        Meeting.createNewMeeting(account._id, newMeeting, (err, meeting) => {
          if (!err) {
            res.status(200).send({
              success: true,
              newMeeting: meeting
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
  })
  .post("/start", (req, res, next) => {
    if (req.headers.token && req.body.idMeeting) {
      Utility.verifyToken(req.headers.token, (err, account) => {
        if (account) {
          Meeting.startMeeting(req.body.idMeeting, (err, meeting) => {
            if(meeting){
              res.status(200).send({
                meeting
              })
            }else{
              res.status(500);
            }
          })
        }else{
          res.status(401).send({
            success: false
          });
        }
      })
    }else{
      res.status(401).send({
        success: false
      });
    }
  })
  .post("/delete", (req, res, next) => {
    if (req.headers.token) {
      Utility.verifyToken(req.headers.token, (err, account) => {
        if (account) {
          Meeting.deleteMeeting(account._id, req.body.idMeeting, (err, meeting) => {
            if (!err) {
              res.status(200).send({
                success: true,
                deletedMeeting: meeting
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