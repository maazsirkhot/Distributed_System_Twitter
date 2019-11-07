`use strict`

import passport from 'passport'
import Users from '../models/mongoDB/users'

var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jwt-secret-key';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	(async() => {
		const user = await Users.findById(jwt_payload)
		if(user){
			return done(null, true)
		} else {
			return done(null, false)
		}
	}) ()
}));