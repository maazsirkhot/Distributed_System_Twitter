`use strict`

import passport from 'passport'
import Users from '../models/mongoDB/users'
import config from '../../config'
import mongoose from 'mongoose'

var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.token;
// console.log("opts", opts.jwtFromRequest)
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
	(async () => {
		// console.log("opts.jwtFromRequest", opts.jwtFromRequest)
		// console.log("jwt_payloaksjdad.id", jwt_payload.id)
		const user = await Users.findById(mongoose.Types.ObjectId(jwt_payload.id))
		// console.log(user)
		if (user) {
			return done(null, true)
		} else {
			return done(null, false)
		}
	})()
}));