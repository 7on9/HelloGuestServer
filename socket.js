let EVENT = require('./common/constant/eventSocket');
let Meeting = require('./controllers/meeting');
let Utility = require('./common/utility');

let mapGuestOfMeeting = new Map();
let mapTimeLineMeeting = new Map();

exports = module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("user connected " + socket.id);
    /************************************START_MEETING********************************************/
    socket.on(EVENT.MEETING.START, (code) => {
      let idMeeting = Utility.getMeetingIdFromCode(code);
      if (idMeeting)
        Meeting.getAllGuestOfMeeting(idMeeting, (err, guests) => {
          mapTimeLineMeeting.set(idMeeting.toString(), { guestAttended: [], timeLine: [] });
          mapGuestOfMeeting.set(idMeeting.toString(), guests);
          socket.join(code);
          socket.emit(EVENT.MEETING.START, EVENT.STATUS.SUCCESS, JSON.stringify(guests))
        })
      else {
        socket.emit(EVENT.MEETING.START, EVENT.STATUS.FAIL)
      }
    })
    /************************************START_MEETING********************************************/

    /************************************END_MEETING********************************************/
    socket.on(EVENT.MEETING.END, (idMeeting) => {
      if (idMeeting) {
        // let attendance = mapTimeLineMeeting.get(idMeeting.toString());
        Meeting.endMeeting(idMeeting, [], (err, res) => {
          socket.emit(EVENT.MEETING.END, EVENT.STATUS.SUCCESS, res);
          // io.sockets.clients(idMeeting).forEach(s => {
          //   s.leave(code);
          // });
        })
      } else {
        socket.emit(EVENT.MEETING.END, EVENT.STATUS.FAIL)
      }
    })
    /************************************END_MEETING********************************************/
    socket.on('disconnect', () => {
      console.log('client ' + socket.id + ' disconnected');
    })
    /************************************JOIN_MEETING********************************************/
    socket.on(EVENT.MEETING.JOIN, code => {
      if (code) {
        let idMeeting = Utility.getMeetingIdFromCode(code.toString());
        if (idMeeting) {
          let listGuest = mapGuestOfMeeting.get(idMeeting);
          let attendance = mapTimeLineMeeting.get(idMeeting);
          if (listGuest) {
            socket.join(code);
            socket.emit(EVENT.MEETING.JOIN, EVENT.STATUS.SUCCESS, listGuest, attendance);
            Meeting.getMeeting(idMeeting, (err, meeting) => {
              socket.emit(EVENT.MEETING.TITLE, {
                welcomeTitle: meeting.welcomeTitle,
                name: meeting.name
              });
            })
          } else {
            socket.emit(EVENT.MEETING.JOIN, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
          }
        } else {
          socket.emit(EVENT.MEETING.JOIN, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
        }
      } else {
        socket.emit(EVENT.MEETING.JOIN, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
      }
    });
    /************************************JOIN_MEETING********************************************/

    /************************************GET_INFO********************************************/
    socket.on(EVENT.GUEST.GET_INFO, (idGuest, code) => {
      /* only for linh trung's ver */
      console.log('Ok xx');
      let email = 'tamdaulong207@yahoo.com'
      // let email = 'linhtrung.thuduc@tphcm.gov.vn'
      Meeting.getGuest(idGuest, email, (err, guest) => {
        if(guest) {
          socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.SUCCESS, guest);
        } else {
          socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
        }
      })
      /* only for linh trung's ver */

      // let idMeeting = Utility.getMeetingIdFromCode(code);
      // if (idMeeting) {
      //   let guests = mapGuestOfMeeting.get(idMeeting);
      //   if (!guests) {
      //     socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
      //     return;
      //   }
      //   let pos = guests.findIndex((guest) => {
      //     return guest._id.toString() == idGuest.toString();
      //   });
      //   if (pos > -1) {
      //     socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.SUCCESS, guests[pos]);
      //   } else {
      //     socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
      //   }
      // } else {
      //   socket.emit(EVENT.GUEST.GET_INFO, EVENT.STATUS.FAIL, EVENT.ERROR.NOT_EXIST);
      // }
    });
    /************************************GET_INFO********************************************/

    /************************************CHECK_IN********************************************/
    socket.on(EVENT.GUEST.CHECKIN, (idGuest, code, email) => {
      //only for linh trung's ver
      Meeting.attend(code, idGuest, 'linhtrung.thuduc@tphcm.gov.vn', (err, success) => {
        socket.emit(EVENT.GUEST.CHECKIN, success ? EVENT.STATUS.SUCCESS : EVENT.STATUS.FAIL);
      })
      // let idMeeting = Utility.getMeetingIdFromCode(code);
      // let attendance = mapTimeLineMeeting.get(idMeeting);
      // if (!attendance.guestAttended.includes(idGuest)) {
      //   attendance.guestAttended.push(idGuest);
      //   attendance.timeLine.push(Date.now() / 1000.0);
      // }
      // io.to(code).emit(EVENT.GUEST.CHECKIN, idGuest, attendance);
    })
    /************************************CHECK_IN********************************************/
  })
}