let jwt = require('jsonwebtoken');
let KEY = require('../common/constant/key');
let ERROR = require('../common/constant/error');

let Account = require('../models/account');
let mapToken = new Map();
let mapCodeMeeting = new Map();
let mapMeetingGuest = new Map();
let meetingCode = 1000;

module.exports = ({
	computingJWT: (email, callback) => {
		let now = Date.now();
		let payload = {
			"email": email,
			"confess": KEY.CONFESS,
			"key": "your name (full)",
			"exp": now + 43200000
		}
		//exp in 12h
		secretKey = KEY.SECRET;
		jwt.sign(payload, secretKey, { algorithm: 'HS256' }, callback);
	},
	getToken: (email) => {
		return mapToken.get(email);
	},
	addNewTokenForAccount: (email, token) => {
		let arrToken = mapToken.get(email);
		if (!arrToken) {
			arrToken = [];
		}
		arrToken.push(token);
		mapToken.set(email, arrToken);
		// mapToken.set(email, token);
	},
	removeTokenForAccount: (email) => {
		mapToken.delete(email);
	},
	createMeetingCode: (idMeeting) => {
		mapCodeMeeting.set((++meetingCode).toString(), idMeeting.toString());
		return meetingCode;
	},
	getMeetingIdFromCode: (code) => {
		return mapCodeMeeting.get(code.toString());
	},
	verifyToken: async (token, callback) => {
		let decodedToken = await jwt.decode(token, KEY.SECRET);
		if (decodedToken) {
			if (decodedToken.exp < Date.now()) {
				mapToken.delete(decodedToken.email);
				return callback(new Error(ERROR.TOKEN.EXPIRED), null);
			} else {
				let tokenByEmail = await mapToken.get(decodedToken.email);
				if (tokenByEmail) {
					if (tokenByEmail.indexOf(token) >= 0) {
						Account.findOne({
							email: decodedToken.email
						}, (err, account) => {
							if (err) {
								return callback(new Error(ERROR.ACCOUNT.NOT_EXIST), null);
							} else {
								if (account) {
									return callback(null, account);
								}
							}
						})
					} else {
						return callback(new Error(ERROR.TOKEN.INVALID), null);
					}
				}
			}
		} else {
			return callback(new Error(ERROR.TOKEN.INVALID), null);
		}
	}
})