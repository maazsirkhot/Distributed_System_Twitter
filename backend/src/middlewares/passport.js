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

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
	(async () => {
		const user = await Users.findById(mongoose.Types.ObjectId(jwt_payload.id))
		if (user) {
			return done(null, true)
		} else {
			return done(null, false)
		}
	})()
}));