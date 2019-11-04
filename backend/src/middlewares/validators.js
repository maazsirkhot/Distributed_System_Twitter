// `use strict`
// var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt;
// import Users from '../models/users'
// import config from '../../config'
// import mongoose from 'mongoose'

// // Setup work and export for the JWT passport strategy
// module.exports = function (passport) {
// 	console.log('in passport')
//     var opts = {
//         jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
//         secretOrKey: config.token
// 	};
// 	console.log('after passport')
//     passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
// 		console.log('jwtpayload---------------->', jwt_payload)
//         Users.findById(mongoose.Types.ObjectId(jwt_payload.id), function (res) {
//             var user = res;
//             delete user.password;
//             callback(null, user);
//         }, function (err) {
// 			console.log('Error in passport------------>', err)
//             return callback(err, false);
//         });
//     }));
// };

`use strict`

import Users from '../models/mongoDB/users'
import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'
import constants from '../utils/constants'
import mongoose from 'mongoose'

export async function ensureUser(req, res, next) {
	console.log('in ensure user')
	const token = getToken(req)
	console.log('token: ', token)
	if (!token) {
		console.log('401 return')
		return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
	}
	let decoded = null
	try {
		decoded = verify(token, config.token)
		console.log('decoded: ', decoded)
		let user = await Users.findById(mongoose.Types.ObjectId(decoded.id))
		console.log('user', user)
		if (!user) {
			console.log('in not user')
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
		}
		req.userId = decoded.id
		req.userName = user.name
	} catch (err) {
		console.log('in catch', err)
		return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
	}
	return next()
}
